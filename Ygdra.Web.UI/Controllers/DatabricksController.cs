using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ygdra.Core.Cloud.Entities;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Http;
using Ygdra.Core.Payloads;

namespace Ygdra.Web.UI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class DatabricksController : YControllerBase
    {
        private readonly IYHttpRequestHandler client;

        public DatabricksController(IYHttpRequestHandler client)
        {
            this.client = client;
        }

        [HttpGet()]
        [Route("{engineId}")]
        [Authorize]
        public Task<YJsonResult<YResource>> GetWorkspaceAsync(Guid engineId)
        {
            return YExecuteAsync(async () =>
            {
                var response = await this.client.ProcessRequestApiAsync<YResource>($"api/DataBricks/{engineId}", null).ConfigureAwait(false);
                return response.Value;
            });
        }

        [HttpPut()]
        [Route("{engineId}")]
        [Authorize]
        public Task<YJsonResult<YResource>> CreateWorkspaceAsync(Guid engineId, [FromBody] YDataBricksPayload payload)
        {
            return YExecuteAsync(async () =>
            {
                var response = await this.client.ProcessRequestApiAsync<YResource>($"api/DataBricks/{engineId}", null, payload, HttpMethod.Put).ConfigureAwait(false);
                return response.Value;
            });
        }

        [HttpDelete()]
        [Route("{engineId}")]
        [Authorize]
        public Task<YJsonResult<YResource>> DeleteWorkspaceAsync(Guid engineId)
        {
            return YExecuteAsync(async () =>
            {
                var response = await this.client.ProcessRequestApiAsync<YResource>($"api/DataBricks/{engineId}", null, null, HttpMethod.Delete).ConfigureAwait(false);
                return response.Value;
            });
        }


        [HttpGet()]
        [Route("{engineId}/cluster")]
        [Authorize]
        public Task<YJsonResult<YDatabricksCluster>> GetWorkspaceClusterAsync(Guid engineId)
        {
            return YExecuteAsync(async () =>
            {
                var response = await this.client.ProcessRequestApiAsync<YDatabricksCluster>($"api/DataBricks/{engineId}/cluster", null).ConfigureAwait(false);
                return response.Value;
            });
        }
    }
}
