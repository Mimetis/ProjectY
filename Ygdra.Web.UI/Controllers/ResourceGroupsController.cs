using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using Ygdra.Core.Cloud.Entities;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Http;
using Ygdra.Core.Options;
using Ygdra.Core.Payloads;

namespace Ygdra.Web.UI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResourceGroupsController : YControllerBase
    {
        private readonly IYHttpRequestHandler client;
        private readonly YMicrosoftIdentityOptions options;

        public ResourceGroupsController(IYHttpRequestHandler client, IOptions<YMicrosoftIdentityOptions> options)
        {
            this.client = client;
            this.options = options.Value;
        }


        [HttpPut()]
        [Route("{name}")]
        [Authorize]
        public Task<YJsonResult<YResource>> CreateResourceGroupAsync(string name, [FromBody] YResourceGroupPayload payload)
        {
            return YExecuteAsync(async () =>
            {
                if (name is null)
                    throw new ArgumentNullException(nameof(name));

                var response = await this.client.ProcessRequestApiAsync<YResource>($"api/ResourceGroups/{name}", null, payload, HttpMethod.Put).ConfigureAwait(false);
                return response.Value;
            });
        }

        [HttpGet()]
        [Route("{name}")]
        [Authorize]
        public Task<YJsonResult<YResource>> GetResourceGroupAsync(string name)
        {
            return YExecuteAsync(async () =>
            {
                if (name is null)
                    throw new ArgumentNullException(nameof(name));

                var response = await this.client.ProcessRequestApiAsync<YResource>($"api/ResourceGroups/{name}", null).ConfigureAwait(false);
                return response.Value;
            });
        }

        [HttpPost()]
        [Route("{name}/link")]
        [Authorize]
        public Task<YJsonResult<string>> GetResourceGroupLink(string name, [FromBody] JObject id)
        {
            return YExecuteAsync(async () =>
            {
                if (id is null)
                    throw new ArgumentNullException(nameof(id));

                var resourceGroupId = id["id"].ToString();

                if (string.IsNullOrEmpty(resourceGroupId))
                    return null;

                if (string.IsNullOrEmpty(this.options.Domain))
                    return null;

                var uri = $"https://ms.portal.azure.com#@{this.options.Domain.TrimStart('/').TrimEnd('/')}/resource/{resourceGroupId.TrimStart('/')}";

                return uri;
            });
        }

    }
}
