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

namespace Ygdra.Host.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [Produces("application/json")]
    public class PurviewController : ControllerBase
    {
        private readonly IYAuthProvider authProvider;
        private YMicrosoftIdentityOptions options;
        private readonly IYHttpRequestHandler client;
        private readonly YPurviewOptions hostOptions;
        private readonly IYEngineProvider engineProvider;
        private const string PurviewApiVersion = "api-version=2018-12-01-preview";
        static readonly string[] scopeRequiredByApi = new string[] { "user_impersonation" };

        public PurviewController(IYAuthProvider authProvider,
        IOptions<YMicrosoftIdentityOptions> azureAdOptions,
        IYHttpRequestHandler client,
        IOptions<YPurviewOptions> hostOptions,
        IYEngineProvider engineProvider)
        {
            this.authProvider = authProvider;
            this.options = azureAdOptions.Value;
            this.client = client;
            this.hostOptions = hostOptions.Value;
            this.engineProvider = engineProvider;
        }

        // [HttpGet()]
        // [Route("Scans/{engineId}")]
        // public async Task GetPurviewScansAsync(Guid engineId)
        // {
        // }

        [HttpPut()]
        [Route("Sources/engine/{engineId}/{datasourcename}")]
        /// <summary>
        /// Registers a new datasource in Purview.
        /// Adds the source to a collection with the name of the engine
        /// </summary>
        public async Task<YHttpResponse<JObject>> AddPurviewSourcesAsync(Guid engineId,string datasourcename, [FromBody] YPurviewSourcePayload dataSource)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);
            if (engine == null)
                throw new Exception("Engine does not exists");

            if (dataSource.Kind != YPurviewSourceKind.AdlsGen2)
                throw new Exception("Purview Source Type not supported yet, please use AdlsGen2");
            
            var accessToken = await this.authProvider.GetAccessTokenForAsync(hostOptions.PurviewResource+"/.default").ConfigureAwait(false);

            var baseURI = hostOptions.PurviewScanEndpoint;
            var query = PurviewApiVersion;

            // Upsert the collection before creating the source
            var pathURICollection = $"datasources/{engine.EngineName}";
            var uriCollection = new System.Uri($"{baseURI}/{pathURICollection}?{query}");
            var jsondataCollection = new JObject{
                {"kind", "Collection"},
                {"properties", new JObject{}}
            };
            YHttpResponse<JObject> yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uriCollection,jsondataCollection,System.Net.Http.HttpMethod.Put,accessToken).ConfigureAwait(false);

            var pathURI = $"datasources/{datasourcename}";
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
            yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uri,jsondata,System.Net.Http.HttpMethod.Put,accessToken).ConfigureAwait(false);
            return yHttpResponse;
        }

        [HttpGet()]
        [Route("Sources/engine/{engineId}/{datasourcename}")]
        /// <summary>
        /// Gets a specific Purview source that belongs to an engine
        /// Assumes the Purview sources will be in a collection with the name of the engine
        /// </summary>
        public async Task<YHttpResponse<JObject>> GetPurviewSourcesAsync(Guid engineId, string datasourcename)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);
            if (engine == null)
                throw new Exception("Engine does not exists");

            var baseURI = hostOptions.PurviewScanEndpoint;
            var query = PurviewApiVersion;
            var pathURI = $"datasources/{datasourcename}";
            var uri = new System.Uri($"{baseURI}/{pathURI}?{query}");
            var accessToken = await this.authProvider.GetAccessTokenForAsync(hostOptions.PurviewResource+"/.default").ConfigureAwait(false);
            YHttpResponse<JObject> yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uri, null, System.Net.Http.HttpMethod.Get, accessToken).ConfigureAwait(false);
            var engineSources = yHttpResponse.Value.SelectToken($"$.properties.parentCollection.referenceName");
            if (engineSources.Value<string>()!=engine.EngineName)
            {
                yHttpResponse.Value = new JObject();
            }
            //yHttpResponse.Value = engineSources.Value<string>()!=engine.EngineName ? new JObject() : engineSources.ToObject<JObject>();
            return yHttpResponse;
        }

        [HttpDelete()]
        [Route("Sources/engine/{engineId}/{datasourcename}")]
        /// <summary>
        /// Deletes a specific Purview source
        /// Assumes the Purview sources will be in a collection with the name of the engine
        /// </summary>
        public async Task<YHttpResponse<JObject>> DeletePurviewSourcesAsync(Guid engineId,string datasourcename)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);
            if (engine == null)
                throw new Exception("Engine does not exists");

            var baseURI = hostOptions.PurviewScanEndpoint;
            var query = PurviewApiVersion;
            var pathURI = $"datasources/{datasourcename}";
            var uri = new System.Uri($"{baseURI}/{pathURI}?{query}");
            var accessToken = await this.authProvider.GetAccessTokenForAsync(hostOptions.PurviewResource+"/.default").ConfigureAwait(false);
            // First check if the source is in the engine the user has entered
            YHttpResponse<JObject> yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uri, null, System.Net.Http.HttpMethod.Get, accessToken).ConfigureAwait(false);
            var engineSources = yHttpResponse.Value.SelectToken($"$.properties.parentCollection.referenceName");
            if (engineSources.Value<string>()!=engine.EngineName)
            {
                throw new Exception($"No source {datasourcename} in your Engine {engine.EngineName}");
            }
            yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uri,null,System.Net.Http.HttpMethod.Delete,accessToken).ConfigureAwait(false);
            return yHttpResponse;
        }

        [HttpGet()]
        [Route("Sources/{datasourcename}")]
        /// <summary>
        /// Gets a specific Purview source
        /// Requires Admin rights as it is across engines
        /// </summary>
        public async Task<YHttpResponse<JObject>> GetPurviewSourcesAsync(string datasourcename)
        {

            HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);

            if (!this.User.IsInRole("Admin"))
                throw new Exception("You should be admin to make a deployment");

            var baseURI = hostOptions.PurviewScanEndpoint;
            var query = PurviewApiVersion;
            var pathURI = $"datasources/{datasourcename}";
            var uri = new System.Uri($"{baseURI}/{pathURI}?{query}");
            var accessToken = await this.authProvider.GetAccessTokenForAsync(hostOptions.PurviewResource+"/.default").ConfigureAwait(false);
            YHttpResponse<JObject> yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uri, null, System.Net.Http.HttpMethod.Get, accessToken).ConfigureAwait(false);
            return yHttpResponse;
        }

        [HttpGet()]
        [Route("Sources/engine/{engineId}/{datasourcename}/scans")]
        /// <summary>
        /// Gets all scan settings for a specific Purview source
        /// Assumes the Purview sources will be in a collection with the name of the engine
        /// </summary>
        public async Task<YHttpResponse<JObject>> GetPurviewSourceScansAsync(Guid engineId, string datasourcename)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);
            if (engine == null)
                throw new Exception("Engine does not exists");

            var baseURI = hostOptions.PurviewScanEndpoint;
            var query = PurviewApiVersion;
            var accessToken = await this.authProvider.GetAccessTokenForAsync(hostOptions.PurviewResource+"/.default").ConfigureAwait(false);
            
            //check if the datasource is in the specified engine
            var pathURISource = $"datasources/{datasourcename}";
            var uriSource = new System.Uri($"{baseURI}/{pathURISource}?{query}");
            YHttpResponse<JObject> yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uriSource,null,System.Net.Http.HttpMethod.Get,accessToken).ConfigureAwait(false);
            var engineSource = yHttpResponse.Value.SelectToken($"$.properties.parentCollection.referenceName");
            if (engineSource.Value<string>()!=engine.EngineName)
                throw new Exception($"The source {datasourcename} does not belong to the collection {engine.EngineName}");

            var pathURI = $"datasources/{datasourcename}/scans";
            var uri = new System.Uri($"{baseURI}/{pathURI}?{query}");
            yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uri,null,System.Net.Http.HttpMethod.Get,accessToken).ConfigureAwait(false);
            return yHttpResponse;

        }

        [HttpPut()]
        [Route("Sources/engine/{engineId}/{datasourcename}/scans/{scanname}")]
        public async Task<YHttpResponse<JObject>> AddPurviewSourceScansAsync(Guid engineId, string datasourcename, string scanname, [FromBody] YPurviewSourceScanPayload scanPayload)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);
            if (engine == null)
                throw new Exception("Engine does not exists");

            var baseURI = hostOptions.PurviewScanEndpoint;
            var query = PurviewApiVersion;
            var accessToken = await this.authProvider.GetAccessTokenForAsync(hostOptions.PurviewResource+"/.default").ConfigureAwait(false);
            
            //check if the datasource is in the specified engine
            var pathURISource = $"datasources/{datasourcename}";
            var uriSource = new System.Uri($"{baseURI}/{pathURISource}?{query}");
            YHttpResponse<JObject> yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uriSource,null,System.Net.Http.HttpMethod.Get,accessToken).ConfigureAwait(false);
            var engineSource = yHttpResponse.Value.SelectToken($"$.properties.parentCollection.referenceName");
            if (engineSource.Value<string>()!=engine.EngineName)
                throw new Exception($"The source {datasourcename} does not belong to the collection {engine.EngineName}");

            var pathURI = $"datasources/{datasourcename}/scans/{scanname}";
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
            yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uri,jsondata,System.Net.Http.HttpMethod.Put,accessToken).ConfigureAwait(false);
            return yHttpResponse;
        }

        [HttpDelete()]
        [Route("Sources/engine/{engineId}/{datasourcename}/scans/{scanname}")]
        public async Task<YHttpResponse<JObject>> DeletePurviewSourceScansAsync(Guid engineId, string datasourcename, string scanname)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);
            if (engine == null)
                throw new Exception("Engine does not exists");

            var baseURI = hostOptions.PurviewScanEndpoint;
            var query = PurviewApiVersion;
            var accessToken = await this.authProvider.GetAccessTokenForAsync(hostOptions.PurviewResource+"/.default").ConfigureAwait(false);
            
            //check if the datasource is in the specified engine
            var pathURISource = $"datasources/{datasourcename}";
            var uriSource = new System.Uri($"{baseURI}/{pathURISource}?{query}");
            YHttpResponse<JObject> yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uriSource,null,System.Net.Http.HttpMethod.Get,accessToken).ConfigureAwait(false);
            var engineSource = yHttpResponse.Value.SelectToken($"$.properties.parentCollection.referenceName");
            if (engineSource.Value<string>()!=engine.EngineName)
                throw new Exception($"The source {datasourcename} does not belong to the collection {engine.EngineName}");

            var pathURI = $"datasources/{datasourcename}/scans/{scanname}";
            var uri = new System.Uri($"{baseURI}/{pathURI}?{query}");
            yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uri,null,System.Net.Http.HttpMethod.Delete,accessToken).ConfigureAwait(false);
            return yHttpResponse;
        }

        [HttpPut()]
        [Route("Sources/engine/{engineId}/{datasourcename}/scans/{scanname}/run")]
        /// <summary>
        /// Runs a scan for a specific Purview source
        /// Assumes the Purview sources will be in a collection with the name of the engine
        /// </summary>
       public async Task<YHttpResponse<JObject>> RunPurviewSourceScanAsync(Guid engineId, string datasourcename, string scanname, [FromBody] YPurviewSourceScanRunPayload scanPayload)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);
            if (engine == null)
                throw new Exception("Engine does not exists");

            var baseURI = hostOptions.PurviewScanEndpoint;
            var query = PurviewApiVersion;
            var accessToken = await this.authProvider.GetAccessTokenForAsync(hostOptions.PurviewResource+"/.default").ConfigureAwait(false);
            
            //check if the datasource is in the specified engine
            var pathURISource = $"datasources/{datasourcename}";
            var uriSource = new System.Uri($"{baseURI}/{pathURISource}?{query}");
            YHttpResponse<JObject> yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uriSource,null,System.Net.Http.HttpMethod.Get,accessToken).ConfigureAwait(false);
            var engineSource = yHttpResponse.Value.SelectToken($"$.properties.parentCollection.referenceName");
            if (engineSource.Value<string>()!=engine.EngineName)
                throw new Exception($"The source {datasourcename} does not belong to the collection {engine.EngineName}");
            
            var runId = Guid.NewGuid();
            var pathURI = $"datasources/{datasourcename}/scans/{scanname}/runs/{runId}";
            var uri = new System.Uri($"{baseURI}/{pathURI}?{query}");
            var jsondata = new JObject 
            {
                {"scanLevel", scanPayload.scanLevel}
            };
            yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uri,jsondata,System.Net.Http.HttpMethod.Put,accessToken).ConfigureAwait(false);
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

            if (!this.User.IsInRole("Admin"))
                throw new Exception("You should be admin to make a deployment");

            var baseURI = hostOptions.PurviewScanEndpoint;
            var query = PurviewApiVersion;
            var pathURI = "datasources/";
            var uri = new System.Uri($"{baseURI}/{pathURI}?{query}");
            var accessToken = await this.authProvider.GetAccessTokenForAsync(hostOptions.PurviewResource+"/.default").ConfigureAwait(false);
            YHttpResponse<JObject> yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uri, null, System.Net.Http.HttpMethod.Get, accessToken).ConfigureAwait(false);
            return yHttpResponse;
        }
        
        [HttpGet()]
        [Route("Sources/engine/{engineId}")]
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

            var baseURI = hostOptions.PurviewScanEndpoint;
            var query = PurviewApiVersion;
            var pathURI = "datasources/";
            var uri = new System.Uri($"{baseURI}/{pathURI}?{query}");
            var accessToken = await this.authProvider.GetAccessTokenForAsync(hostOptions.PurviewResource+"/.default").ConfigureAwait(false);
            YHttpResponse<JObject> yHttpResponse = await this.client.ProcessRequestAsync<JObject>(uri, null, System.Net.Http.HttpMethod.Get, accessToken).ConfigureAwait(false);
            var engineSources = yHttpResponse.Value.SelectToken($"$.value[?(@.properties.parentCollection.referenceName=='{engine.EngineName}')]");
            yHttpResponse.Value = engineSources is null ? null : engineSources.ToObject<JObject>();
            return yHttpResponse;
        }


    }
}
