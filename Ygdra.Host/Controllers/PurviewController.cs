using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text.Json.Serialization;
using Azure;
using Azure.Identity;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Files.DataLake;
using Azure.Storage.Files.DataLake.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.Resource;
using Microsoft.Extensions.Options;
using Microsoft.Rest;
using Newtonsoft.Json.Linq;
using Ygdra.Core.Auth;
using Ygdra.Core.Engine;
using Ygdra.Core.Http;
using Ygdra.Core.Options;
using Ygdra.Core.Payloads;
using Ygdra.Core.Cloud;
using Ygdra.Core.Cloud.Entities;
using Newtonsoft.Json;

namespace Ygdra.Host.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [Produces("application/json")]
    public class PurviewController : ControllerBase
    {
        private readonly IYResourceClient resourceClient;
        private readonly IYAuthProvider authProvider;
        private readonly YMicrosoftIdentityOptions options;
        private readonly IYHttpRequestHandler client;
        private readonly YPurviewOptions purviewOptions;
        private readonly IYEngineProvider engineProvider;
        private readonly DataFactoriesController factoryController;
        private const string PurviewApiVersion = "api-version=2018-12-01-preview";
        private const string PurviewApiManagementVersion = "2020-12-01-preview";
        static readonly string[] scopeRequiredByApi = new string[] { "user_impersonation" };

        public PurviewController(IYResourceClient resourceClient, IYAuthProvider authProvider,
        IOptions<YMicrosoftIdentityOptions> azureAdOptions,
        IYHttpRequestHandler client,
        IOptions<YPurviewOptions> hostOptions,
        IYEngineProvider engineProvider,
        DataFactoriesController dataFactoriesController)
        {
            this.resourceClient = resourceClient;
            this.authProvider = authProvider;
            this.options = azureAdOptions.Value;
            this.client = client;
            this.purviewOptions = hostOptions.Value;
            this.engineProvider = engineProvider;
            this.factoryController = dataFactoriesController;
        }


        [HttpPut()]
        [Route("Sources/{engineId}/{dataSourceName}")]
        /// <summary>
        /// Registers a new datasource in Purview.
        /// Adds the source to a collection with the name of the engine
        /// </summary>
        public async Task<YHttpResponse<JObject>> AddPurviewSourcesAsync(Guid engineId, string dataSourceName, [FromBody] YPurviewSourcePayload dataSource)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);
            if (engine == null)
                throw new Exception("Engine does not exists");

            if (dataSource.Kind != YPurviewSourceKind.AdlsGen2)
                throw new Exception("Purview Source Type not supported yet, please use AdlsGen2");

            var accessToken = await this.authProvider.GetAccessTokenForPurviewAsync().ConfigureAwait(false);

            var baseURI = purviewOptions.ScanEndpoint;
            var query = PurviewApiVersion;

            // Upsert the collection before creating the source
            var pathURICollection = $"datasources/{engine.EngineName}";
            var uriCollection = new System.Uri($"{baseURI}/{pathURICollection}?{query}");
            var jsondataCollection = new JObject{
                {"kind", "Collection"},
                {"properties", new JObject{}}
            };
            YHttpResponse<JObject> yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uriCollection, jsondataCollection, System.Net.Http.HttpMethod.Put, accessToken).ConfigureAwait(false);

            var pathURI = $"datasources/{dataSourceName}";
            var uri = new System.Uri($"{baseURI}/{pathURI}?{query}");
            var jsondata = new JObject {
                    {"kind", dataSource.Kind.ToString()},
                    {"properties", new JObject{
                        {"endpoint", dataSource.Properties.endpoint},
                        {"subscriptionId", dataSource.Properties.subscriptionId},
                        {"resourceGroup", dataSource.Properties.resourceGroup},
                        {"location", dataSource.Properties.location},
                        {"parentCollection", new JObject{
                            {"type","DataSourceReference"},
                            {"referenceName", engine.EngineName}
                        }}
                    }}};
            yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uri, jsondata, System.Net.Http.HttpMethod.Put, accessToken).ConfigureAwait(false);
            return yHttpResponse;
        }


        [HttpGet()]
        [Route("")]
        /// <summary>
        /// Gets a specific Purview source that belongs to an engine
        /// Assumes the Purview sources will be in a collection with the name of the engine
        /// </summary>
        public async Task<YHttpResponse<YResource>> GetPurviewAsync()
        {
            var resourceResponse = await this.resourceClient.GetAsync<JObject>
                (null, "Microsoft.Purview", "", "accounts", "", PurviewApiManagementVersion).ConfigureAwait(false);

            if (resourceResponse == null || !resourceResponse.Value.ContainsKey("value"))
                return YHttpResponse<YResource>.NotFound;

            var allPurviewAccounts = resourceResponse.Value["value"] as JArray;

            var purviewAccountObject = allPurviewAccounts.Where(pv => pv["name"].Value<string>() == this.purviewOptions.AccountName).FirstOrDefault() as JObject;

            if (purviewAccountObject == null)
                return YHttpResponse<YResource>.NotFound;

            var purviewAccount = purviewAccountObject.ToObject<YResource>();

            return new YHttpResponse<YResource>(purviewAccount);
        }

        [HttpGet()]
        [Route("Sources/{engineId}/{dataSourceName}")]
        /// <summary>
        /// Gets a specific Purview source that belongs to an engine
        /// Assumes the Purview sources will be in a collection with the name of the engine
        /// </summary>
        public async Task<YHttpResponse<JObject>> GetPurviewSourcesAsync(Guid engineId, string dataSourceName)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);
            if (engine == null)
                throw new Exception("Engine does not exists");

            var baseURI = purviewOptions.ScanEndpoint;
            var query = PurviewApiVersion;
            var pathURI = $"datasources/{dataSourceName}";
            var uri = new System.Uri($"{baseURI}/{pathURI}?{query}");
            var accessToken = await this.authProvider.GetAccessTokenForPurviewAsync().ConfigureAwait(false);
            YHttpResponse<JObject> yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uri, null, System.Net.Http.HttpMethod.Get, accessToken).ConfigureAwait(false);
            var engineSources = yHttpResponse.Value.SelectToken($"$.properties.parentCollection.referenceName");
            if (engineSources.Value<string>() != engine.EngineName)
            {
                yHttpResponse.Value = new JObject();
            }
            //yHttpResponse.Value = engineSources.Value<string>()!=engine.EngineName ? new JObject() : engineSources.ToObject<JObject>();
            return yHttpResponse;
        }

        [HttpDelete()]
        [Route("Sources/{engineId}/{dataSourceName}")]
        /// <summary>
        /// Deletes a specific Purview source
        /// Assumes the Purview sources will be in a collection with the name of the engine
        /// </summary>
        public async Task<YHttpResponse<JObject>> DeletePurviewSourcesAsync(Guid engineId, string dataSourceName)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);
            if (engine == null)
                throw new Exception("Engine does not exists");

            var baseURI = purviewOptions.ScanEndpoint;
            var query = PurviewApiVersion;
            var pathURI = $"datasources/{dataSourceName}";
            var uri = new System.Uri($"{baseURI}/{pathURI}?{query}");
            var accessToken = await this.authProvider.GetAccessTokenForPurviewAsync().ConfigureAwait(false);
            // First check if the source is in the engine the user has entered
            YHttpResponse<JObject> yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uri, null, System.Net.Http.HttpMethod.Get, accessToken).ConfigureAwait(false);
            var engineSources = yHttpResponse.Value.SelectToken($"$.properties.parentCollection.referenceName");
            if (engineSources.Value<string>() != engine.EngineName)
            {
                throw new Exception($"No source {dataSourceName} in your Engine {engine.EngineName}");
            }
            yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uri, null, System.Net.Http.HttpMethod.Delete, accessToken).ConfigureAwait(false);
            return yHttpResponse;
        }

        //[HttpGet()]
        //[Route("Sources/{dataSourceName}")]
        ///// <summary>
        ///// Gets a specific Purview source
        ///// Requires Admin rights as it is across engines
        ///// </summary>
        //public async Task<YHttpResponse<JObject>> GetPurviewSourcesAsync(string dataSourceName)
        //{

        //    HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);

        //    if (!this.User.IsInRole("Admin"))
        //        throw new Exception("You should be admin to make a deployment");

        //    var baseURI = purviewOptions.ScanEndpoint;
        //    var query = PurviewApiVersion;
        //    var pathURI = $"datasources/{dataSourceName}";
        //    var uri = new System.Uri($"{baseURI}/{pathURI}?{query}");
        //    var accessToken = await this.authProvider.GetAccessTokenForPurviewAsync().ConfigureAwait(false);
        //    YHttpResponse<JObject> yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uri, null, System.Net.Http.HttpMethod.Get, accessToken).ConfigureAwait(false);
        //    return yHttpResponse;
        //}

        [HttpGet()]
        [Route("Sources/{engineId}/{dataSourceName}/scans")]
        /// <summary>
        /// Gets all scan settings for a specific Purview source
        /// Assumes the Purview sources will be in a collection with the name of the engine
        /// </summary>
        public async Task<YHttpResponse<JObject>> GetPurviewSourceScansAsync(Guid engineId, string dataSourceName)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);
            if (engine == null)
                throw new Exception("Engine does not exists");

            var baseURI = purviewOptions.ScanEndpoint;
            var query = PurviewApiVersion;
            var accessToken = await this.authProvider.GetAccessTokenForPurviewAsync().ConfigureAwait(false);

            //check if the datasource is in the specified engine
            var pathURISource = $"datasources/{dataSourceName}";
            var uriSource = new System.Uri($"{baseURI}/{pathURISource}?{query}");
            YHttpResponse<JObject> yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uriSource, null, System.Net.Http.HttpMethod.Get, accessToken).ConfigureAwait(false);
            var engineSource = yHttpResponse.Value.SelectToken($"$.properties.parentCollection.referenceName");
            if (engineSource.Value<string>() != engine.EngineName)
                throw new Exception($"The source {dataSourceName} does not belong to the collection {engine.EngineName}");

            var pathURI = $"datasources/{dataSourceName}/scans";
            var uri = new System.Uri($"{baseURI}/{pathURI}?{query}");
            yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uri, null, System.Net.Http.HttpMethod.Get, accessToken).ConfigureAwait(false);
            return yHttpResponse;

        }

        [HttpPut()]
        [Route("Sources/{engineId}/{dataSourceName}/scans/{scanName}")]
        public async Task<YHttpResponse<JObject>> AddPurviewSourceScansAsync(Guid engineId, string dataSourceName, string scanName, [FromBody] YPurviewSourceScanPayload scanPayload)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);
            if (engine == null)
                throw new Exception("Engine does not exists");

            var baseURI = purviewOptions.ScanEndpoint;
            var query = PurviewApiVersion;
            var accessToken = await this.authProvider.GetAccessTokenForPurviewAsync().ConfigureAwait(false);

            //check if the datasource is in the specified engine
            var pathURISource = $"datasources/{dataSourceName}";
            var uriSource = new System.Uri($"{baseURI}/{pathURISource}?{query}");
            YHttpResponse<JObject> yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uriSource, null, System.Net.Http.HttpMethod.Get, accessToken).ConfigureAwait(false);
            var engineSource = yHttpResponse.Value.SelectToken($"$.properties.parentCollection.referenceName");
            if (engineSource.Value<string>() != engine.EngineName)
                throw new Exception($"The source {dataSourceName} does not belong to the collection {engine.EngineName}");

            var pathURI = $"datasources/{dataSourceName}/scans/{scanName}";
            var uri = new System.Uri($"{baseURI}/{pathURI}?{query}");
            var jsondata = new JObject
            {
                {"kind", scanPayload.Kind},
                {"properties", new JObject{
                    {"credential", new JObject {
                        {"referenceName", scanPayload.properties.credential.referenceName},
                        {"credentialType", scanPayload.properties.credential.credentialType}
                    }},
                    {"scanRulesetName",scanPayload.properties.scanRuleSetName},
                    {"scanRuleSetType", scanPayload.properties.scanRuleSetType}
                }}
            };
            yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uri, jsondata, System.Net.Http.HttpMethod.Put, accessToken).ConfigureAwait(false);
            return yHttpResponse;
        }

        [HttpDelete()]
        [Route("Sources/{engineId}/{dataSourceName}/scans/{scanName}")]
        public async Task<YHttpResponse<JObject>> DeletePurviewSourceScansAsync(Guid engineId, string dataSourceName, string scanName)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);
            if (engine == null)
                throw new Exception("Engine does not exists");

            var baseURI = purviewOptions.ScanEndpoint;
            var query = PurviewApiVersion;
            var accessToken = await this.authProvider.GetAccessTokenForPurviewAsync().ConfigureAwait(false);

            //check if the datasource is in the specified engine
            var pathURISource = $"datasources/{dataSourceName}";
            var uriSource = new System.Uri($"{baseURI}/{pathURISource}?{query}");
            YHttpResponse<JObject> yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uriSource, null, System.Net.Http.HttpMethod.Get, accessToken).ConfigureAwait(false);
            var engineSource = yHttpResponse.Value.SelectToken($"$.properties.parentCollection.referenceName");
            if (engineSource.Value<string>() != engine.EngineName)
                throw new Exception($"The source {dataSourceName} does not belong to the collection {engine.EngineName}");

            var pathURI = $"datasources/{dataSourceName}/scans/{scanName}";
            var uri = new System.Uri($"{baseURI}/{pathURI}?{query}");
            yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uri, null, System.Net.Http.HttpMethod.Delete, accessToken).ConfigureAwait(false);
            return yHttpResponse;
        }

        [HttpPut()]
        [Route("Sources/{engineId}/{dataSourceName}/scans/{scanName}/run")]
        /// <summary>
        /// Runs a scan for a specific Purview source
        /// Assumes the Purview sources will be in a collection with the name of the engine
        /// </summary>
        public async Task<YHttpResponse<JObject>> RunPurviewSourceScanAsync(Guid engineId, string dataSourceName, string scanName, [FromBody] YPurviewSourceScanRunPayload scanPayload)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);
            if (engine == null)
                throw new Exception("Engine does not exists");

            var baseURI = purviewOptions.ScanEndpoint;
            var query = PurviewApiVersion;
            var accessToken = await this.authProvider.GetAccessTokenForPurviewAsync().ConfigureAwait(false);

            //check if the datasource is in the specified engine
            var pathURISource = $"datasources/{dataSourceName}";
            var uriSource = new System.Uri($"{baseURI}/{pathURISource}?{query}");
            YHttpResponse<JObject> yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uriSource, null, System.Net.Http.HttpMethod.Get, accessToken).ConfigureAwait(false);
            var engineSource = yHttpResponse.Value.SelectToken($"$.properties.parentCollection.referenceName");
            if (engineSource.Value<string>() != engine.EngineName)
                throw new Exception($"The source {dataSourceName} does not belong to the collection {engine.EngineName}");

            var runId = Guid.NewGuid();
            var pathURI = $"datasources/{dataSourceName}/scans/{scanName}/runs/{runId}";
            var uri = new System.Uri($"{baseURI}/{pathURI}?{query}");
            var jsondata = new JObject
            {
                {"scanLevel", scanPayload.scanLevel}
            };
            yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uri, jsondata, System.Net.Http.HttpMethod.Put, accessToken).ConfigureAwait(false);
            return yHttpResponse;
        }


        [HttpGet()]
        [Route("Sources")]
        /// <summary>
        /// Gets all sources registered in Purview. Can only be run by Admins
        /// </summary>
        public async Task<YHttpResponse<JObject>> GetPurviewSourcesAsync()
        {
            HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);

            var baseURI = purviewOptions.ScanEndpoint;
            var query = PurviewApiVersion;
            var pathURI = "datasources/";
            var uri = new System.Uri($"{baseURI}/{pathURI}?{query}");

            var accessToken = await this.authProvider.GetAccessTokenForPurviewAsync().ConfigureAwait(false);

            YHttpResponse<JObject> yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uri, null, System.Net.Http.HttpMethod.Get, accessToken).ConfigureAwait(false);
            return yHttpResponse;
        }

        [HttpGet()]
        [Route("Sources/{engineId}")]
        /// <summary>
        /// Gets Purview sources that belong to an engine
        /// Assumes the Purview sources will be in a collection with the name of the engine
        /// The result - list of all sources - is filtered by collection name
        /// </summary>
        public async Task<YHttpResponse<JObject>> GetPurviewSourcesByEngineAsync(Guid engineId)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);
            if (engine == null)
                throw new Exception("Engine does not exists");

            var baseURI = purviewOptions.ScanEndpoint;
            var query = PurviewApiVersion;
            var pathURI = "datasources/";
            var uri = new System.Uri($"{baseURI}/{pathURI}?{query}");
            var accessToken = await this.authProvider.GetAccessTokenForPurviewAsync().ConfigureAwait(false);
            YHttpResponse<JObject> yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uri, null, System.Net.Http.HttpMethod.Get, accessToken).ConfigureAwait(false);
            var engineSources = yHttpResponse.Value.SelectToken($"$.value[?(@.properties.parentCollection.referenceName=='{engine.EngineName}')]");
            yHttpResponse.Value = engineSources is null ? null : engineSources.ToObject<JObject>();
            return yHttpResponse;
        }

        [HttpPut()]
        [Route("Factory/{engineId}")]
        /// <summary>
        /// Connects the Data Factory of the specified Engine to Purview
        /// Creates a Role assignment as Purview Data Curator for the ADF Managed Identity to access Purview
        /// Tags the ADF so that the connection to Purview is enabled
        /// </summary>
        public async Task<YHttpResponse<JObject>> ConnectFactoryToPurviewAsync(Guid engineId)
        {

            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);
            if (engine == null)
                throw new Exception("Engine does not exists");

            var factoryResult = await factoryController.GetDataFactoryAsync(engineId).ConfigureAwait(false);
            var factoryResource = factoryResult.Value;


            // Role Definition Id of Purview Data Curator Role
            // /subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/8a3c2885-9b38-4fd2-9d99-91af537c1347"
            var factoryRoleDefinition = $"/subscriptions/{this.options.SubscriptionId}/providers/Microsoft.Authorization/roleDefinitions/8a3c2885-9b38-4fd2-9d99-91af537c1347";


            // scope: Purview Account
            var purviewAccount = await GetPurviewAsync();
            // /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Purview/accounts/{accountName}?api-version=2020-12-01-preview
            //var purviewScope = $"/subscriptions/{this.options.SubscriptionId}/resourceGroups/{purviewOptions.ResourceGroup}/providers/Microsoft.Purview/accounts/{purviewAccountName}";
            var purviewScope = purviewAccount.Value.Id;

            var roleAssignmentName = Guid.NewGuid();
            var assignmentUri = $"{purviewScope}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentName}";
            var query = "api-version=2021-04-01-preview";
            var requestBody = new JObject {
                {"properties", new JObject {
                    {"roleDefinitionId", factoryRoleDefinition },
                    {"principalId", factoryResource.Identity.PrincipalId}
                }}
            };
            var result = await this.client.ProcessRequestManagementAsync<JObject>(
                assignmentUri, query, requestBody, System.Net.Http.HttpMethod.Put).ConfigureAwait(false);

            var purviewUri = this.purviewOptions.AtlasEndpoint.Replace("https://", "");

            // Tag the Factory with catalogUri=PurviewAtlasEndpoint without https://
            // Tags - Create Or Update At Scope
            // PUT https://management.azure.com/{scope}/providers/Microsoft.Resources/tags/default?api-version=2021-04-01
            // {scope} is the ADF id
            requestBody = new JObject{
                {"properties", new JObject{
                    {"tags", new JObject{
                        {"catalogUri", purviewUri}
                    }}
                }}
            };
            query = "api-version=2021-04-01";
            var tagUri = $"{factoryResource.Id}/providers/Microsoft.Resources/tags/default";
            result = await this.client.ProcessRequestManagementAsync<JObject>(
                tagUri, query, requestBody, System.Net.Http.HttpMethod.Put).ConfigureAwait(false);
            return result;
        }

    }
}
