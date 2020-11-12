using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Ygdra.Core.Cloud;
using Ygdra.Core.Cloud.Entities;
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
    public class ResourceGroupsController : ControllerBase
    {
        private IYResourceClient client;
        private const string ApiVersion = "2020-06-01";

        public ResourceGroupsController(IYResourceClient client)
        {
            this.client = client;
        }

        [HttpPut()]
        [Route("{name}")]
        public async Task<YResource> CreateResourceGroupAsync(string name, [FromBody] YResourceGroupPayload payload)
        {


            payload.Location.EnsureLocation();
            name.EnsureStringIsLetterOrDigit();

            var check = await this.client.CheckResourceNameIsValidAsync(name, "Microsoft.Resources/subscriptions/resourcegroups");

            if (check.Value.Status != "Allowed")
                throw new Exception($"Name {name} is not allowed");

            var resourceRequest = new YResource
            {
                Location = payload.Location,
                Tags = payload.Tags
            };

            var resourceResponse = await this.client.CreateOrUpdateAsync(name, ApiVersion, resourceRequest);

            return resourceResponse.Value;
        }

        [HttpDelete()]
        [Route("{name}")]
        public async Task<YResource> DeleteResourceGroupAsync(string name)
        {

            name.EnsureStringIsLetterOrDigit();

            var resourceResponse = await this.client.DeleteAsync(name, ApiVersion);

            return resourceResponse.Value;

        }


        [HttpGet()]
        [Route("{name}")]
        public async Task<YResource> GetResourceGroupAsync(string name)
        {

            name.EnsureStringIsLetterOrDigit();

            var resourceResponse = await this.client.GetAsync(name, ApiVersion);

            return resourceResponse.Value;

        }

    }
}
