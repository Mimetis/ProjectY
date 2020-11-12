using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using Ygdra.Core.Cloud;
using Ygdra.Core.Cloud.Entities;
using Ygdra.Core.Engine;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Http;
using Ygdra.Core.Options;
using Ygdra.Core.Payloads;
using Ygdra.Host.Extensions;

namespace Ygdra.Host.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [Produces("application/json")]
    public class DataBricksController : ControllerBase
    {
        private IYResourceClient resourceClient;
        private readonly IYHttpRequestHandler client;
        private readonly IYEngineProvider engineProvider;
        private readonly KeyVaultsController keyVaultsController;
        private YMicrosoftIdentityOptions options;
        private const string DataBricksApiVersion = "2018-04-01";

        public DataBricksController(IYResourceClient resourceClient,
            IYHttpRequestHandler client,
            IYEngineProvider engineProvider,
            KeyVaultsController keyVaultsController,
            IOptions<YMicrosoftIdentityOptions> azureAdOptions)
        {
            this.resourceClient = resourceClient;
            this.client = client;
            this.engineProvider = engineProvider;
            this.keyVaultsController = keyVaultsController;
            this.options = azureAdOptions.Value;

        }

        [HttpPut()]
        [Route("{engineId}")]
        public async Task<ActionResult<YResource>> CreateDataBricksWorkspaceAsync(Guid engineId, [FromBody] YDataBricksPayload payload)
        {
            payload.Location.EnsureLocation();

            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            var resourceGroupName = engine.ResourceGroupName;
            var workspaceName = engine.ClusterName;


            var managedResourceGroupId = string.IsNullOrEmpty(payload.ManagedResourceGroupId) ? $"dataBricks-{resourceGroupName}" : payload.ManagedResourceGroupId;

            if (managedResourceGroupId == resourceGroupName)
                throw new Exception($"The managed resource group can not have the same name as resource group name");

            // Create Databricks payload
            var resourceRequest = new YResource
            {
                Location = payload.Location,
                Properties = new Dictionary<string, object>()
                    {
                        { "managedResourceGroupId", $"/subscriptions/{this.options.SubscriptionId}/resourceGroups/{managedResourceGroupId}" }
                    }
            };

            var resourceResponse = await this.resourceClient.StartCreateOrUpdateAsync
                (resourceGroupName, "Microsoft.Databricks", "", "workspaces", workspaceName, DataBricksApiVersion, resourceRequest);

            var provisioningState = resourceResponse.Value.Properties["provisioningState"].ToString();

            if (provisioningState == "Accepted" || provisioningState == "Succeeded")
            {
                engine = await this.engineProvider.GetEngineAsync(payload.EngineId);
                await this.engineProvider.SaveEngineAsync(engine);
            }

            return resourceResponse.Value;

        }

        [HttpDelete()]
        [Route("{engineId}")]
        public async Task<ActionResult<YResource>> DeleteDataBricksWorkspaceAsync(Guid engineId)
        {

            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            var resourceGroupName = engine.ResourceGroupName;
            var workspaceName = engine.ClusterName;

            var resourceResponse = await this.resourceClient.StartDeleteAsync
                (resourceGroupName, "Microsoft.Databricks", "", "workspaces", workspaceName, DataBricksApiVersion);

            return resourceResponse.Value;

        }

        [HttpGet()]
        [Route("{engineId}")]
        public async Task<ActionResult<YResource>> GetDataBricksWorkspaceAsync(Guid engineId)
        {

            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            var resourceGroupName = engine.ResourceGroupName;
            var workspaceName = engine.ClusterName;

            var resourceResponse = await this.resourceClient.GetAsync
                (resourceGroupName, "Microsoft.Databricks", "", "workspaces", workspaceName, DataBricksApiVersion);

            return resourceResponse.Value;

        }


        [HttpGet()]
        [Route("{engineId}/cluster")]
        public async Task<ActionResult<YDatabricksCluster>> GetDataBricksWorkspaceClusterAsync(Guid engineId)
        {

            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            var resourceGroupName = engine.ResourceGroupName;
            var workspaceName = engine.ClusterName;

            if (engine == null)
                throw new Exception("Engine does not exists");

            // Get Databricks token
            var tokenSecret = await keyVaultsController.GetKeyVaultSecret(engine.Id, engine.ClusterName);

            string token = tokenSecret?.Value;

            if (string.IsNullOrEmpty(token))
                throw new Exception("Engine has not been created or token is empty");

            var resourceResponse = await this.resourceClient.GetAsync
                (resourceGroupName, "Microsoft.Databricks", "", "workspaces", workspaceName, DataBricksApiVersion);

            var workspace = resourceResponse.Value;

            // Url for creating a cluster
            var dbricksUriBuilder = new UriBuilder($"https://{workspace.Properties["workspaceUrl"]}");

            dbricksUriBuilder.Path = "api/2.0/clusters/list";
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


            dbricksUriBuilder.Path = "api/2.0/clusters/get";
            dbricksUriBuilder.Query = $"cluster_id={clusterId}";
            dbricksWorkspaceUrl = dbricksUriBuilder.Uri;

            var clusterStateResponse = await this.client.ProcessRequestAsync<YDatabricksCluster>(dbricksWorkspaceUrl, null, HttpMethod.Get, token);

            if (clusterStateResponse == null || clusterStateResponse.StatusCode != HttpStatusCode.OK || clusterStateResponse.Value == null)
                throw new Exception($"Unable to get cluster {engine.ClusterName} from Databricks workspace {engine.ClusterName}");

            return clusterStateResponse.Value;

        }


        [HttpGet()]
        [Route("{engineId}/cluster/users")]
        public async Task<ActionResult<JObject>> GetDataBricksWorkspaceClusterUsersAsync(Guid engineId)
        {

            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            var resourceGroupName = engine.ResourceGroupName;
            var workspaceName = engine.ClusterName;

            if (engine == null)
                throw new Exception("Engine does not exists");

            // Get Databricks token
            var tokenSecret = await keyVaultsController.GetKeyVaultSecret(engine.Id, engine.ClusterName);

            string token = tokenSecret?.Value;

            var resourceResponse = await this.resourceClient.GetAsync
                (resourceGroupName, "Microsoft.Databricks", "", "workspaces", workspaceName, DataBricksApiVersion);

            var workspace = resourceResponse.Value;

            // Url for creating a cluster
            var dbricksUriBuilder = new UriBuilder($"https://{workspace.Properties["workspaceUrl"]}");

            dbricksUriBuilder.Path = "api/2.0/preview/scim/v2/Users";
            var dbricksWorkspaceUrl = dbricksUriBuilder.Uri;

            // Get all the dbricks cluster already created
            var dbricksClustersResponse = await this.client.ProcessRequestAsync<JObject>(dbricksWorkspaceUrl, null, HttpMethod.Get, token);

            if (dbricksClustersResponse == null || dbricksClustersResponse.StatusCode != HttpStatusCode.OK || dbricksClustersResponse.Value == null)
                throw new Exception($"Unable to get the cluster users list {engine.ClusterName}");

            return dbricksClustersResponse.Value;

        }

    }
}
