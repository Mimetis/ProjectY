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
using Microsoft.Extensions.Options;
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
        private YMicrosoftIdentityOptions options;
        private const string DataFactoryApiVersion = "2018-06-01";
        private const string DataBricksApiVersion = "2018-04-01";

        public DataFactoriesController(IYResourceClient resourceClient,
            IYHttpRequestHandler client,
            IYEngineProvider engineProvider,
            IOptions<YMicrosoftIdentityOptions> azureAdOptions,
            KeyVaultsController keyVaultsController,
            IYDataSourcesService dataSourcesService)
        {
            this.resourceClient = resourceClient;
            this.client = client;
            this.engineProvider = engineProvider;
            this.keyVaultsController = keyVaultsController;
            this.dataSourcesService = dataSourcesService;
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

            //var pathUri = $"/subscriptions/{options.SubscriptionId}/resourceGroups/{engine.ResourceGroupName}" +
            //              $"/providers/Microsoft.DataFactory/factories/{engine.FactoryName}" +
            //              $"/linkedservices/{dataSourceName}";

            //var query = $"api-version={DataFactoryApiVersion}";

            //// Get the response. we may want to create a real class for this result ?
            //var response = await this.client.ProcessRequestManagementAsync<YDataSourceUnknown>(
            //    pathUri, query).ConfigureAwait(false);

            //if (response.StatusCode == HttpStatusCode.NotFound)
            //    return new NotFoundResult();

            //var dataSource = response.Value;


            var entityPathUri = $"/subscriptions/{options.SubscriptionId}" +
                          $"/resourceGroups/{engine.ResourceGroupName}/providers/Microsoft.DataFactory" +
                          $"/factories/{engine.FactoryName}/datasets/{entityName}";

            var entityQuery = $"api-version={DataFactoryApiVersion}";


            // Get the response. we may want to create a real class for this result ?
            var responseEntity = await this.client.ProcessRequestManagementAsync<YEntityUnknown>(
                entityPathUri, entityQuery, entity, HttpMethod.Put).ConfigureAwait(false);


            // -------------------------
            // PIPELINE


            string version = entity.Version.Replace(".", "_");


            if (string.IsNullOrEmpty(version))
                version = "v1";

            // try to create a Copy Pipeline
            string pipelineName = $"Copy_{dataSourceName.ToLower()}_{entityName.ToLower()}_{version.ToLower()}";


            var pipelinePathUri = $"/subscriptions/{options.SubscriptionId}" +
              $"/resourceGroups/{engine.ResourceGroupName}/providers/Microsoft.DataFactory" +
              $"/factories/{engine.FactoryName}/pipelines/{pipelineName}";

            var pipelineQuery = $"api-version={DataFactoryApiVersion}";


            var copyPipeline = new Pipeline
            {
                Name = pipelineName
            };

            var copyActivity = new Activity
            {
                Name = "Copy",
                Type = "Copy"
            };

            copyActivity.TypeProperties.Source.Type = entity.EntityType switch
            {
                YEntityType.DelimitedText => "DelimitedTextSource",
                YEntityType.AzureSqlTable => "AzureSqlSource",
                YEntityType.Parquet => "ParquetSource",
                _ => "DelimitedTextSource",
            };


            if (entity.EntityType == YEntityType.Parquet || entity.EntityType == YEntityType.DelimitedText)
            {
                copyActivity.TypeProperties.Source.StoreSettings = new StoreSettings();
                copyActivity.TypeProperties.Source.StoreSettings.Recursive = true;
                copyActivity.TypeProperties.Source.StoreSettings.WildcardFileName = "*";
                copyActivity.TypeProperties.Source.StoreSettings.Type = "AzureBlobStorageReadSettings";
            }
            else
            {
                copyActivity.TypeProperties.Source.PartitionOption = "none";
            }

            copyActivity.TypeProperties.Sink.Type = "ParquetSink";
            copyActivity.TypeProperties.Sink.StoreSettings.Type = "AzureBlobFSWriteSettings";
            copyActivity.TypeProperties.Sink.FormatSettings.Type = "ParquetWriteSettings";

            copyActivity.Inputs.Add(new Input
            {
                ReferenceName = entity.Name,
                Type = "DatasetReference"
            });

            var output = new Output
            {
                ReferenceName = "destinationOutput",
                Type = "DatasetReference",
            };
            output.Parameters.FileSystem.Type = "Expression";
            output.Parameters.FileSystem.Value = "@pipeline().parameters.destinationContainer";
            output.Parameters.FolderPath.Type = "Expression";
            output.Parameters.FolderPath.Value = "@{pipeline().parameters.destinationFolderPath}/@{formatDateTime(pipeline().parameters.windowStart,'yyyy')}/@{formatDateTime(pipeline().parameters.windowStart,'MM')}/@{formatDateTime(pipeline().parameters.windowStart,'dd')}/@{formatDateTime(pipeline().parameters.windowStart,'HH')}";

            copyActivity.Outputs.Add(output);

            copyPipeline.Properties.Activities.Add(copyActivity);

            copyPipeline.Properties.Parameters.DestinationContainer.DefaultValue = "bronze";
            copyPipeline.Properties.Parameters.DestinationFolderPath.DefaultValue = $"{dataSourceName}/{entityName}/{version}";
            copyPipeline.Properties.Parameters.WindowStart.DefaultValue = DateTime.Now;


            var jsonPipeline = JsonConvert.SerializeObject(copyPipeline);

            // Get the response. we may want to create a real class for this result ?
            var pipeline = await this.client.ProcessRequestManagementAsync<JObject>(
                pipelinePathUri, pipelineQuery, copyPipeline, HttpMethod.Put).ConfigureAwait(false);


            return responseEntity.Value;
        }
    }
}
