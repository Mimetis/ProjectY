using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Azure.SignalR.Management;
using Newtonsoft.Json.Linq;
using Ygdra.Core.Cloud.Entities;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Exceptions;
using Ygdra.Core.Http;
using Ygdra.Web.UI.SignalR;

namespace Ygdra.Web.UI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class EnginesController : YControllerBase
    {
        private readonly IYHttpRequestHandler client;

        public EnginesController(IYHttpRequestHandler client)
        {
            this.client = client;
        }

        [HttpGet()]
        [Authorize]
        public Task<YJsonResult<List<YEngine>>> GetEnginesAsync()
        {
            return YExecuteAsync(async () =>
            {
                var response = await this.client.ProcessRequestApiAsync<List<YEngine>>($"api/Engines", null).ConfigureAwait(false);
                return response.Value;
            });

        }

        [HttpGet()]
        [Route("{id}")]
        [Authorize]
        public Task<YJsonResult<YEngine>> GetEngineAsync(Guid? id)
        {
            return YExecuteAsync(async () =>
            {
                if (!id.HasValue)
                    throw new ArgumentNullException(nameof(id));

                var response = await this.client.ProcessRequestApiAsync<YEngine>($"api/Engines/{id.Value}", null).ConfigureAwait(false);
                return response.Value;
            });
        }

        [HttpPut()]
        [Route("{id}")]
        [Authorize]
        public Task<YJsonResult<YEngine>> SaveEngineAsync(Guid? id, [FromBody] YEngine engine)
        {
            return YExecuteAsync(async () =>
            {
                if (!id.HasValue)
                    throw new ArgumentNullException(nameof(id));

                var response = await this.client.ProcessRequestApiAsync<YEngine>($"api/Engines/{id}", null, engine, HttpMethod.Put).ConfigureAwait(false);

                return response.Value;

            });
        }

        [HttpPost()]
        [Route("{id}/deploy")]
        [Authorize]
        public Task<YJsonResult<JObject>> DeployEngineAsync(Guid? id)
        {
            return YExecuteAsync(async () =>
            {
                if (!id.HasValue)
                    throw new ArgumentNullException(nameof(id));

                var engine = await this.client.ProcessRequestApiAsync<YEngine>($"api/Engines/{id.Value}",
                    null).ConfigureAwait(false);

                var response = await this.client.ProcessRequestApiAsync<JObject>($"api/Engines/{id}/deploy",
                    null, engine.Value, HttpMethod.Post).ConfigureAwait(false);

                return response.Value;
            });
        }

        [HttpDelete()]
        [Route("{id}")]
        [Authorize]
        public Task<YJsonResult<JObject>> DeleteEngineAsync(Guid? id)
        {
            return YExecuteAsync(async () =>
            {
                if (!id.HasValue)
                    throw new ArgumentNullException(nameof(id));

                var response = await this.client.ProcessRequestApiAsync<JObject>($"api/Engines/{id}",
                    null, null, HttpMethod.Delete).ConfigureAwait(false);

                return response.Value;
            });

        }

    }
}
