using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Management.DataFactory;
using Microsoft.Azure.Management.DataFactory.Models;
using Microsoft.Extensions.Options;
using Microsoft.Rest;
using Microsoft.Rest.Azure;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Ygdra.Core.Auth;
using Ygdra.Core.Cloud;
using Ygdra.Core.Cloud.Entities;
using Ygdra.Core.DataSources.Entities;
using Ygdra.Core.Engine;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Entities.Entities;
using Ygdra.Core.Http;
using Ygdra.Core.Options;
using Ygdra.Core.Payloads;
using Ygdra.Core.Pipelines.Entities;
using Ygdra.Core.Triggers.Entities;
using Ygdra.Host.Extensions;
using Ygdra.Host.Services;

namespace Ygdra.Host.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [Produces("application/json")]
    public class DataFactoriesController : ControllerBase
    {
        private IYResourceClient resourceClient;
        private readonly IYHttpRequestHandler client;
        private readonly IYEngineProvider engineProvider;
        private readonly KeyVaultsController keyVaultsController;
        private readonly IYDataSourcesService dataSourcesService;
        private readonly IYAuthProvider authProvider;
        private YMicrosoftIdentityOptions options;
        private const string DataFactoryApiVersion = "2018-06-01";
        private const string DataBricksApiVersion = "2018-04-01";

        public DataFactoriesController(IYResourceClient resourceClient,
            IYHttpRequestHandler client,
            IYEngineProvider engineProvider,
            IOptions<YMicrosoftIdentityOptions> azureAdOptions,
            KeyVaultsController keyVaultsController,
            IYDataSourcesService dataSourcesService,
            IYAuthProvider authProvider)
        {
            this.resourceClient = resourceClient;
            this.client = client;
            this.engineProvider = engineProvider;
            this.keyVaultsController = keyVaultsController;
            this.dataSourcesService = dataSourcesService;
            this.authProvider = authProvider;
            this.options = azureAdOptions.Value;

        }

        [HttpGet()]
        [Route("{engineId}")]
        public async Task<ActionResult<YResource>> GetDataFactoryAsync(Guid engineId)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            var resourceResponse = await this.resourceClient.GetAsync
                (engine.ResourceGroupName, "Microsoft.DataFactory", "", "factories", engine.FactoryName, DataFactoryApiVersion);

            return resourceResponse.Value;

        }

        [HttpPut()]
        [Route("{engineId}/links/{dataSourceName}")]
        public async Task<ActionResult<YDataSource>> AddDataSourceAsync(Guid engineId,
            string dataSourceName, [FromBody] YDataSourceUnknown dataSource)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            var regex = new Regex(@"^[a-zA-Z0-9--]{3,24}$");
            if (!regex.IsMatch(dataSourceName))
                throw new Exception($"DataSource name {dataSourceName} is incorrect");

            var resourceGroupName = engine.ResourceGroupName;
            var factoryName = engine.FactoryName;

            var pathUri = $"/subscriptions/{options.SubscriptionId}" +
                          $"/resourceGroups/{resourceGroupName}/providers/Microsoft.DataFactory" +
                          $"/factories/{factoryName}/linkedservices/{dataSourceName}";

            var query = $"api-version={DataFactoryApiVersion}";

            var typedDataSource = YDataSourceFactory.GetTypedDatSource(dataSource);

            // get sensitive string if any
            string sensitiveString = typedDataSource.GetSensitiveString();

            if (!string.IsNullOrEmpty(sensitiveString))
            {
                // Save the connection string to KeyVault
                await keyVaultsController.SetKeyVaultSecret(engineId, dataSourceName,
                    new YKeyVaultSecretPayload { Key = dataSourceName, Value = sensitiveString });

            }

            // Get the response. we may want to create a real class for this result ?
            var response = await this.client.ProcessRequestManagementAsync<YDataSourceUnknown>(
                pathUri, query, typedDataSource, HttpMethod.Put).ConfigureAwait(false);

            return response.Value;
        }


        [HttpPut()]
        [Route("{engineId}/links/databricks/{dataSourceName}")]
        public async Task<ActionResult<JObject>> AddDatabricksLinkService(Guid engineId, string dataSourceName)
        {

            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            // Get Databricks token
            var tokenSecret = await keyVaultsController.GetKeyVaultSecret(engine.Id, engine.ClusterName);

            string token = tokenSecret?.Value;

            var resourceGroupName = engine.ResourceGroupName;
            var clusterName = engine.ClusterName;
            var factoryName = engine.FactoryName;

            var pathUri = $"/subscriptions/{options.SubscriptionId}/resourceGroups/{resourceGroupName}" +
                          $"/providers/Microsoft.DataFactory/factories/{factoryName}" +
                          $"/linkedservices/{dataSourceName}";

            var query = $"api-version={DataFactoryApiVersion}";

            var resourceResponse = await this.resourceClient.GetAsync
                (resourceGroupName, "Microsoft.Databricks", "", "workspaces", clusterName, DataBricksApiVersion);

            var workspace = resourceResponse.Value;
            var workspaceUrl = $"https://{workspace.Properties["workspaceUrl"]}";

            var dbricksUriBuilder = new UriBuilder(workspaceUrl)
            {
                Path = "api/2.0/clusters/list"
            };
            var dbricksWorkspaceUrl = dbricksUriBuilder.Uri;

            // Get all the dbricks cluster already created
            var dbricksClustersResponse = await this.client.ProcessRequestAsync<YDatabricksClusters>(dbricksWorkspaceUrl, null, HttpMethod.Get, token);

            if (dbricksClustersResponse == null || dbricksClustersResponse.StatusCode != HttpStatusCode.OK || dbricksClustersResponse.Value == null)
                throw new Exception($"Unable to get the clusters list from Databricks workspace {engine.ClusterName}");

            var clusterList = dbricksClustersResponse.Value;
            var clusterId = string.Empty;

            if (clusterList?.Clusters == null || !clusterList.Clusters.Any(c => c.ClusterName == engine.ClusterName))
                return new NotFoundResult();

            var cluster = clusterList.Clusters.First(c => c.ClusterName == engine.ClusterName);
            clusterId = cluster.ClusterId;

            var typeProperties = new JObject
                {
                    { "properties", new JObject {
                        { "type", "AzureDatabricks" },
                        { "description", "Databricks Linked Service, created during deployment" },
                        { "typeProperties", new JObject {
                            { "domain", workspaceUrl },
                            { "accessToken", new JObject
                                {
                                    { "type", "SecureString" },
                                    { "value", token }
                                }
                            },
                            { "existingClusterId", clusterId }
                        }
                    }}},
                };

            // Get the response. we may want to create a real class for this result ?
            var dbricksTokenResponse = await this.client.ProcessRequestManagementAsync<JObject>(
                pathUri, query, typeProperties, HttpMethod.Put).ConfigureAwait(false);

            return dbricksTokenResponse.Value;

        }


        [HttpPost()]
        [Route("{engineId}/test")]
        public async Task<IActionResult> TestAsync(Guid engineId, [FromBody] YDataSourceUnknown dataSource)
        {
            var isOk = await this.dataSourcesService.TestAsync(dataSource);
            return new JsonResult(isOk);
        }


        [HttpGet()]
        [Route("{engineId}/links")]
        public async Task<IActionResult> GetDataSourcesAsync(Guid engineId)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            var resourceGroupName = engine.ResourceGroupName;
            var factoryName = engine.FactoryName;

            var pathUri = $"/subscriptions/{options.SubscriptionId}/resourceGroups/{resourceGroupName}" +
                          $"/providers/Microsoft.DataFactory/factories/{factoryName}" +
                          $"/linkedservices";
            var query = $"api-version={DataFactoryApiVersion}";

            // Get the response. we may want to create a real class for this result ?
            var dbricksTokenResponse = await this.client.ProcessRequestManagementAsync<YDataSources>(
                pathUri, query).ConfigureAwait(false);

            if (dbricksTokenResponse.StatusCode == HttpStatusCode.NotFound)
                return new NotFoundResult();

            var dataSources = dbricksTokenResponse.Value.Value;

            return new YJsonResult<List<YDataSourceUnknown>>(dataSources);
        }


        [HttpGet()]
        [Route("{engineId}/triggers")]
        public async Task<IActionResult> GetTriggersAsync(Guid engineId)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            var resourceGroupName = engine.ResourceGroupName;
            var factoryName = engine.FactoryName;

            var pathUri = $"/subscriptions/{options.SubscriptionId}/resourceGroups/{resourceGroupName}" +
                          $"/providers/Microsoft.DataFactory/factories/{factoryName}" +
                          $"/triggers";
            var query = $"api-version={DataFactoryApiVersion}";

            // Get the response. we may want to create a real class for this result ?
            var response = await this.client.ProcessRequestManagementAsync<JObject>(
                pathUri, query).ConfigureAwait(false);

            if (response.StatusCode == HttpStatusCode.NotFound)
                return new NotFoundResult();

            var triggers = response.Value["Value"];

            return new YJsonResult<JToken>(triggers);
        }


        [HttpGet()]
        [Route("{engineId}/links/{dataSourceName}")]
        public async Task<ActionResult<YDataSource>> GetDataSourceAsync(Guid engineId, string dataSourceName)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            var resourceGroupName = engine.ResourceGroupName;
            var factoryName = engine.FactoryName;

            var pathUri = $"/subscriptions/{options.SubscriptionId}/resourceGroups/{resourceGroupName}" +
                          $"/providers/Microsoft.DataFactory/factories/{factoryName}" +
                          $"/linkedservices/{dataSourceName}";

            var query = $"api-version={DataFactoryApiVersion}";

            // Get the response. we may want to create a real class for this result ?
            var response = await this.client.ProcessRequestManagementAsync<YDataSourceUnknown>(
                pathUri, query).ConfigureAwait(false);

            if (response.StatusCode == HttpStatusCode.NotFound)
                return new NotFoundResult();

            var dataSource = response.Value;

            return dataSource;
        }

        [HttpGet()]
        [Route("{engineId}/entities")]
        public async Task<ActionResult<List<YEntityUnknown>>> GetEntitiesAsync(Guid engineId)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            var resourceGroupName = engine.ResourceGroupName;
            var factoryName = engine.FactoryName;

            var pathUri = $"/subscriptions/{options.SubscriptionId}/resourceGroups/{resourceGroupName}" +
                          $"/providers/Microsoft.DataFactory/factories/{factoryName}" +
                          $"/datasets";
            var query = $"api-version={DataFactoryApiVersion}";

            // Get the response. we may want to create a real class for this result ?
            var datasetsTokenResponse = await this.client.ProcessRequestManagementAsync<YEntities>(
                pathUri, query).ConfigureAwait(false);

            if (datasetsTokenResponse.StatusCode == HttpStatusCode.NotFound)
                return new NotFoundResult();

            var entities = datasetsTokenResponse.Value.Value;

            return entities.ToList();
        }

        [HttpGet()]
        [Route("{engineId}/entities/{entityName}")]
        public async Task<ActionResult<YEntityUnknown>> GetEntityAsync(Guid engineId, string entityName)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            var resourceGroupName = engine.ResourceGroupName;
            var factoryName = engine.FactoryName;

            var pathUri = $"/subscriptions/{options.SubscriptionId}/resourceGroups/{resourceGroupName}" +
                          $"/providers/Microsoft.DataFactory/factories/{factoryName}" +
                          $"/datasets/{entityName}";
            var query = $"api-version={DataFactoryApiVersion}";

            // Get the response. we may want to create a real class for this result ?
            var datasetsTokenResponse = await this.client.ProcessRequestManagementAsync<YEntityUnknown>(
                pathUri, query).ConfigureAwait(false);

            if (datasetsTokenResponse.StatusCode == HttpStatusCode.NotFound)
                return new NotFoundResult();

            return datasetsTokenResponse.Value;
        }


        [HttpGet()]
        [Route("{engineId}/daemon/entities/{entityName}")]
        public async Task<ActionResult<YEntityUnknown>> GetEntityFromDaemonAsync(Guid engineId, string entityName)
        {
            var userObjectId = this.User.GetObjectId();

            if (string.IsNullOrEmpty(userObjectId))
                return new UnauthorizedObjectResult("Daemon id unknown");

            if (userObjectId != this.options.ClientObjectId)
                return new UnauthorizedObjectResult("This web api should be called only from a daemon application using the correct Client Id / Client Secret");

            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            var resourceGroupName = engine.ResourceGroupName;
            var factoryName = engine.FactoryName;

            var pathUri = $"/subscriptions/{options.SubscriptionId}/resourceGroups/{resourceGroupName}" +
                          $"/providers/Microsoft.DataFactory/factories/{factoryName}" +
                          $"/datasets/{entityName}";
            var query = $"api-version={DataFactoryApiVersion}";

            // Get the response. we may want to create a real class for this result ?
            var datasetsTokenResponse = await this.client.ProcessRequestManagementAsync<YEntityUnknown>(
                pathUri, query).ConfigureAwait(false);

            if (datasetsTokenResponse.StatusCode == HttpStatusCode.NotFound)
                return new NotFoundResult();

            return datasetsTokenResponse.Value;
        }


        [HttpGet()]
        [Route("{engineId}/daemon/entities")]
        public async Task<ActionResult<List<YEntity>>> GetEntitiesFromDaemonAsync(Guid engineId)
        {

            var userObjectId = this.User.GetObjectId();

            if (string.IsNullOrEmpty(userObjectId))
                return new UnauthorizedObjectResult("Daemon id unknown");

            if (userObjectId != this.options.ClientObjectId)
                return new UnauthorizedObjectResult("This web api should be called only from a daemon application using the correct Client Id / Client Secret");

            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            var resourceGroupName = engine.ResourceGroupName;
            var factoryName = engine.FactoryName;

            var pathUri = $"/subscriptions/{options.SubscriptionId}/resourceGroups/{resourceGroupName}" +
                          $"/providers/Microsoft.DataFactory/factories/{factoryName}" +
                          $"/datasets";
            var query = $"api-version={DataFactoryApiVersion}";

            // Get the response. we may want to create a real class for this result ?
            var datasetsTokenResponse = await this.client.ProcessRequestManagementAsync<YEntities>(
                pathUri, query).ConfigureAwait(false);

            if (datasetsTokenResponse.StatusCode == HttpStatusCode.NotFound)
                return new NotFoundResult();

            var entities = datasetsTokenResponse.Value.Value;

            return entities.Select(e => YEntityFactory.GetTypedEntity(e)).ToList();
        }


        [HttpGet]
        [Route("{engineId}/pipelines/{dataSourceName}/entities/{entityName}")]
        public async Task<ActionResult<List<YPipeline>>> GetPipelinesAsync(Guid engineId, string dataSourceName, string entityName)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            var query = $"api-version={DataFactoryApiVersion}";

            // Get Datasource
            var regex = new Regex(@"^[a-zA-Z0-9--]{3,24}$");

            if (!regex.IsMatch(dataSourceName))
                throw new Exception($"DataSource name {dataSourceName} is incorrect");

            var entityPathUri = $"/subscriptions/{options.SubscriptionId}" +
                          $"/resourceGroups/{engine.ResourceGroupName}/providers/Microsoft.DataFactory" +
                          $"/factories/{engine.FactoryName}/datasets/{entityName}";

            var responseEntity = await this.client.ProcessRequestManagementAsync<YEntityUnknown>(
                entityPathUri, query).ConfigureAwait(false);

            if (responseEntity.StatusCode != HttpStatusCode.OK)
                throw new Exception($"Can't get entity {entityName} to get pipelines");


            var pipelinesPathUri = $"/subscriptions/{options.SubscriptionId}" +
              $"/resourceGroups/{engine.ResourceGroupName}/providers/Microsoft.DataFactory" +
              $"/factories/{engine.FactoryName}/pipelines";

            var pipelinesResponse = await this.client.ProcessRequestManagementAsync<YPipelines>(
                    pipelinesPathUri, query).ConfigureAwait(false);

            if (pipelinesResponse.StatusCode != HttpStatusCode.OK)
                throw new Exception($"Can't get pipelines for entity {entityName}");

            var pipelines = pipelinesResponse.Value.Value;

            return pipelines.Where(p => p.Name.ToLowerInvariant().StartsWith($"{dataSourceName.ToLowerInvariant()}_{entityName.ToLowerInvariant()}")).ToList();


        }


        [HttpGet]
        [Route("v2/{engineId}/pipelines/")]
        public async Task<ActionResult<List<PipelineResource>>> GetPipelines2Async(Guid engineId, string dataSourceName, string entityName)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");


            var accessToken = await this.authProvider.GetAccessTokenForAppManagementAsync().ConfigureAwait(false);

            ServiceClientCredentials tokenCredentials = new TokenCredentials(accessToken);

            DataFactoryManagementClient client = new DataFactoryManagementClient(tokenCredentials) { SubscriptionId = this.options.SubscriptionId };

            var pagedPipelines = await client.Pipelines.ListByFactoryAsync(engine.ResourceGroupName, engine.FactoryName);
            var nextPageLink = pagedPipelines.NextPageLink;

            var pipelines = new List<PipelineResource>();

            do
            {
                pipelines.AddRange(pagedPipelines.ToList());
            } while (!string.IsNullOrEmpty(nextPageLink));

            return pipelines;
        }


        [HttpGet()]
        [Route("v2/{engineId}/links")]
        public async Task<ActionResult<List<LinkedServiceResource>>> GetDataSources2Async(Guid engineId)
        {
            try
            {

                var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

                if (engine == null)
                    throw new Exception("Engine does not exists");


                var accessToken = await this.authProvider.GetAccessTokenForAppManagementAsync().ConfigureAwait(false);

                ServiceClientCredentials tokenCredentials = new TokenCredentials(accessToken);

                DataFactoryManagementClient client = new DataFactoryManagementClient(tokenCredentials) { SubscriptionId = this.options.SubscriptionId };

                var operations = await client.Operations.ListAsync();

                AzureOperationResponse<IPage<LinkedServiceResource>> pagedDataSources
                    = await client.LinkedServices.ListByFactoryWithHttpMessagesAsync(engine.ResourceGroupName, engine.FactoryName);



                //var pagedDataSources = client.LinkedServices.ListByFactory(engine.ResourceGroupName, engine.FactoryName);
                var nextPageLink = pagedDataSources.Body.NextPageLink;

                var dataSources = new List<LinkedServiceResource>();

                do
                {
                    dataSources.AddRange(pagedDataSources.Body.ToList());
                } while (!string.IsNullOrEmpty(nextPageLink));

                return dataSources;
            }
            catch (Exception ex)
            {

                throw;
            }
        }



        [HttpPut()]
        [Route("v2/{engineId}/links/{dataSourceName}")]
        public async Task<ActionResult<LinkedServiceResource>> AddDataSource2Async(Guid engineId,
            string dataSourceName, [FromBody] LinkedService linkedService)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            var accessToken = await this.authProvider.GetAccessTokenForAppManagementAsync().ConfigureAwait(false);

            ServiceClientCredentials tokenCredentials = new TokenCredentials(accessToken);

            DataFactoryManagementClient client = new DataFactoryManagementClient(tokenCredentials) { SubscriptionId = this.options.SubscriptionId };

            // Create the linked service resource
            LinkedServiceResource linkedServiceResource = new LinkedServiceResource(linkedService);

            string sensitiveString = linkedServiceResource.Properties switch
            {
                AzureStorageLinkedService azureStorageLinkedService => azureStorageLinkedService.ConnectionString.ToString(),
                _ => null

            };

            if (!string.IsNullOrEmpty(sensitiveString))
            {
                // Save the connection string to KeyVault
                await keyVaultsController.SetKeyVaultSecret(engineId, dataSourceName,
                    new YKeyVaultSecretPayload { Key = dataSourceName, Value = sensitiveString });

            }

            var newLinkedServiceResourceCreated = await client.LinkedServices.CreateOrUpdateAsync(engine.ResourceGroupName,engine.FactoryName, dataSourceName, linkedServiceResource);

            return newLinkedServiceResourceCreated;
        }


        [HttpGet]
        [Route("v2/{engineId}/entities")]
        public async Task<ActionResult<List<DatasetResource>>> GetEntities2Async(Guid engineId)
        {

            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            var accessToken = await this.authProvider.GetAccessTokenForAppManagementAsync().ConfigureAwait(false);

            ServiceClientCredentials tokenCredentials = new TokenCredentials(accessToken);

            DataFactoryManagementClient client = new DataFactoryManagementClient(tokenCredentials) { SubscriptionId = this.options.SubscriptionId };

            var datasets = new List<DatasetResource>();
            var datasetsPage = await client.Datasets.ListByFactoryAsync(engine.ResourceGroupName, engine.FactoryName);
            var nextPageLink = datasetsPage.NextPageLink;

            do
            {
                datasets.AddRange(datasetsPage.ToList());
            } while (!string.IsNullOrEmpty(nextPageLink));

            return datasets;
        }


        [HttpPut]
        [Route("{engineId}/links/{dataSourceName}/entities/{entityName}")]
        public async Task<ActionResult<YEntity>> AddEntityAsync(Guid engineId, string dataSourceName, string entityName, [FromBody] YEntityUnknown entity)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            // Get Datasource
            var regex = new Regex(@"^[a-zA-Z0-9--]{3,24}$");

            if (!regex.IsMatch(dataSourceName))
                throw new Exception($"DataSource name {dataSourceName} is incorrect");

            var entityPathUri = $"/subscriptions/{options.SubscriptionId}" +
                          $"/resourceGroups/{engine.ResourceGroupName}/providers/Microsoft.DataFactory" +
                          $"/factories/{engine.FactoryName}/datasets/{entityName}";

            var entityQuery = $"api-version={DataFactoryApiVersion}";

            var responseEntity = await this.client.ProcessRequestManagementAsync<YEntityUnknown>(
                entityPathUri, entityQuery, entity, HttpMethod.Put).ConfigureAwait(false);

            await CreatePipelineAsync(engine, entity).ConfigureAwait(false);

            return responseEntity.Value;
        }


        [HttpPut]
        [Route("{engineId}/pipelines/{dataSourceName}/entities/{entityName}")]
        public async Task<ActionResult<YEntity>> AddPipelineAsync(Guid engineId, string dataSourceName, string entityName, [FromBody] YEntityUnknown entity)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");


            // Get Datasource
            var regex = new Regex(@"^[a-zA-Z0-9--]{3,24}$");

            if (!regex.IsMatch(dataSourceName))
                throw new Exception($"DataSource name {dataSourceName} is incorrect");

            var entityPathUri = $"/subscriptions/{options.SubscriptionId}" +
                          $"/resourceGroups/{engine.ResourceGroupName}/providers/Microsoft.DataFactory" +
                          $"/factories/{engine.FactoryName}/datasets/{entityName}";

            var entityQuery = $"api-version={DataFactoryApiVersion}";

            var responseEntity = await this.client.ProcessRequestManagementAsync<YEntityUnknown>(
                entityPathUri, entityQuery, entity, HttpMethod.Put).ConfigureAwait(false);

            await CreatePipelineAsync(engine, entity).ConfigureAwait(false);

            return responseEntity.Value;
        }





        private async Task CreatePipelineAsync(YEngine engine, YEntity entity)
        {
            // -------------------------
            // PIPELINE


            string version = entity.Version.Replace(".", "_");


            if (string.IsNullOrEmpty(version))
                version = "v1";

            // try to create a Copy Pipeline
            string pipelineName = $"{entity.DataSourceName.ToLower()}_{entity.Name.ToLower()}_{version.ToLower()}";


            var pipelinePathUri = $"/subscriptions/{options.SubscriptionId}" +
              $"/resourceGroups/{engine.ResourceGroupName}/providers/Microsoft.DataFactory" +
              $"/factories/{engine.FactoryName}/pipelines/{pipelineName}";

            var pipelineQuery = $"api-version={DataFactoryApiVersion}";


            var copyPipeline = new YPipeline
            {
                Name = pipelineName
            };

            // Copy Pipeline

            var copyActivity = new YPipelineActivity
            {
                Name = "Loading",
                Type = "Copy"
            };

            var source = new YPipelineSource
            {
                Type = entity.EntityType switch
                {
                    YEntityType.DelimitedText => "DelimitedTextSource",
                    YEntityType.AzureSqlTable => "AzureSqlSource",
                    YEntityType.Parquet => "ParquetSource",
                    _ => "DelimitedTextSource",
                }
            };

            if (entity.EntityType == YEntityType.Parquet || entity.EntityType == YEntityType.DelimitedText)
            {
                source.StoreSettings = new YPipelineStoreSettings();
                source.StoreSettings.Recursive = true;
                source.StoreSettings.WildcardFileName = "*";
                source.StoreSettings.Type = "AzureBlobStorageReadSettings";
            }
            else if (entity.EntityType == YEntityType.AzureSqlTable)
            {
                // only creates if we have the entity supporting it AND request by the method
                if (entity.Mode == "Delta")
                {
                    var sqlEntity = YEntityFactory.GetTypedEntity(entity) as YEntityAzureSqlTable;

                    source.SqlReaderQuery = new YValueType
                    {
                        Type = "Expression",
                        Value = $"Declare @startDate Datetime = '@{{formatDateTime(pipeline().parameters.windowStart, 'yyyy-MM-dd HH:mm')}}'; " +
                                $"Declare @fullLoad boolean = @{{pipeline().parameters.fullLoad}}; " +
                                $"Select * From [{sqlEntity.Schema}].[{sqlEntity.Table}] " +
                                $"Where ([ModifiedDate] >= @startDate And @fullLoad = 0) OR (@fullLoad = 1)"
                    };
                }
                source.PartitionOption = "none";
            }
            else
            {
                source.PartitionOption = "none";

            }

            copyActivity.TypeProperties.Add("source", JObject.FromObject(source));

            var sink = new YPipelineSink { Type = "ParquetSink" };
            sink.StoreSettings.Type = "AzureBlobFSWriteSettings";
            sink.FormatSettings.Type = "ParquetWriteSettings";
            copyActivity.TypeProperties.Add("sink", JObject.FromObject(sink));

            copyActivity.TypeProperties.Add("enableStaging", false);


            copyActivity.Inputs = new List<YPipelineReference>();
            copyActivity.Inputs.Add(new YPipelineReference
            {
                ReferenceName = entity.Name,
                Type = "DatasetReference"
            });

            var output = new YPipelineOutput
            {
                ReferenceName = "destinationOutput",
                Type = "DatasetReference",
            };
            output.Parameters.FileSystem.Type = "Expression";
            output.Parameters.FileSystem.Value = "@pipeline().parameters.destinationContainer";
            output.Parameters.FolderPath.Type = "Expression";
            output.Parameters.FolderPath.Value = "@{pipeline().parameters.destinationFolderPath}/@{formatDateTime(pipeline().parameters.windowStart,'yyyy')}/@{formatDateTime(pipeline().parameters.windowStart,'MM')}/@{formatDateTime(pipeline().parameters.windowStart,'dd')}/@{formatDateTime(pipeline().parameters.windowStart,'HH')}";

            copyActivity.Outputs = new List<YPipelineOutput>();
            copyActivity.Outputs.Add(output);

            copyPipeline.Properties.Activities.Add(copyActivity);

            // databricks 

            var dbricksActivity = new YPipelineActivity
            {
                Name = "Transform",
                Type = "DatabricksNotebook"
            };

            var dependOn = new YPipelineDependsOn { Activity = "Loading" };
            dependOn.DependencyConditions.Add("Succeeded");
            dbricksActivity.DependsOn.Add(dependOn);

            dbricksActivity.LinkedServiceName = new YPipelineReference { ReferenceName = $"dsDatabricks-{engine.ClusterName}", Type = "LinkedServiceReference" };

            dbricksActivity.TypeProperties.Add("notebookPath", "/Shared/main");
            dbricksActivity.TypeProperties.Add("baseParameters", new JObject {
                        { "entityName", new JObject { { "value", "@{pipeline().parameters.entityName}" },{ "type", "Expression" } } },
                        { "inputPath", new JObject { { "value", "@{concat(pipeline().parameters.destinationFolderPath, '/', formatDateTime(pipeline().parameters.windowStart,'yyyy'), '/', formatDateTime(pipeline().parameters.windowStart,'MM'), '/', formatDateTime(pipeline().parameters.windowStart,'dd'), '/', formatDateTime(pipeline().parameters.windowStart,'HH'))}" },{ "type", "Expression" } } },
                        { "outputPath", new JObject { { "value", "@{pipeline().parameters.deltaFolderPath}" },{ "type", "Expression" } } },
                        { "inputContainer", new JObject { { "value", "@{pipeline().parameters.destinationContainer}" },{ "type", "Expression" } } },
                        { "outputContainer", new JObject { { "value", "@{pipeline().parameters.deltaContainer}" },{ "type", "Expression" } } }

                    });

            copyPipeline.Properties.Activities.Add(dbricksActivity);


            copyPipeline.Properties.Parameters.Add("windowStart", JObject.FromObject(new YPipelineParameter { DefaultValue = DateTime.Now }));
            copyPipeline.Properties.Parameters.Add("fullLoad", JObject.FromObject(new YPipelineParameter { DefaultValue = "1" }));
            copyPipeline.Properties.Parameters.Add("destinationContainer", JObject.FromObject(new YPipelineParameter { DefaultValue = "bronze" }));
            copyPipeline.Properties.Parameters.Add("destinationFolderPath", JObject.FromObject(new YPipelineParameter { DefaultValue = $"{entity.DataSourceName}/{entity.Name}/{version}" }));
            copyPipeline.Properties.Parameters.Add("deltaContainer", JObject.FromObject(new YPipelineParameter { DefaultValue = "silver" }));
            copyPipeline.Properties.Parameters.Add("deltaFolderPath", JObject.FromObject(new YPipelineParameter { DefaultValue = $"{entity.DataSourceName}/{entity.Name}/{version}" }));
            copyPipeline.Properties.Parameters.Add("engineId", JObject.FromObject(new YPipelineParameter { DefaultValue = engine.Id }));
            copyPipeline.Properties.Parameters.Add("dataSourceName", JObject.FromObject(new YPipelineParameter { DefaultValue = entity.DataSourceName }));
            copyPipeline.Properties.Parameters.Add("entityName", JObject.FromObject(new YPipelineParameter { DefaultValue = entity.Name }));


            //var jsonPipeline = JsonConvert.SerializeObject(copyPipeline);

            // Get the response. we may want to create a real class for this result ?
            var pipeline = await this.client.ProcessRequestManagementAsync<JObject>(
                pipelinePathUri, pipelineQuery, copyPipeline, HttpMethod.Put).ConfigureAwait(false);


            var triggerName = $"trg_{pipelineName}";

            var triggerPathUri = $"/subscriptions/{options.SubscriptionId}" +
              $"/resourceGroups/{engine.ResourceGroupName}/providers/Microsoft.DataFactory" +
              $"/factories/{engine.FactoryName}/triggers/{triggerName}";


            var trigger = new YTrigger();

            var pipelineRef = new YTriggerTriggerPipeline();
            pipelineRef.PipelineReference.ReferenceName = pipelineName;
            pipelineRef.Parameters = new JObject {
                { "windowStart", "@trigger().startTime" },
                { "fullLoad", "0" }
            };

            trigger.Properties.Pipelines.Add(pipelineRef);

            trigger.Properties.RuntimeState = "Started";
            trigger.Properties.Type = "ScheduleTrigger";

            // Get the response. we may want to create a real class for this result ?
            var newTrigger = await this.client.ProcessRequestManagementAsync<JObject>(
                triggerPathUri, pipelineQuery, trigger, HttpMethod.Put).ConfigureAwait(false);


            var triggerStartUri = $"/subscriptions/{options.SubscriptionId}" +
                  $"/resourceGroups/{engine.ResourceGroupName}/providers/Microsoft.DataFactory" +
                  $"/factories/{engine.FactoryName}/triggers/{triggerName}/start";

            // Get the response. we may want to create a real class for this result ?
            var newTriggerStarted = await this.client.ProcessRequestManagementAsync<JObject>(
                triggerStartUri, pipelineQuery, null, HttpMethod.Post).ConfigureAwait(false);
        }
    }
}
