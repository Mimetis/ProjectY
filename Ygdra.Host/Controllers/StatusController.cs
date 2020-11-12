using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ygdra.Core.Cloud;
using Ygdra.Core.Cloud.Entities;
using Ygdra.Core.Http;

namespace Ygdra.Host.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [Produces("application/json")]
    public class StatusController : ControllerBase
    {
        private IYResourceClient client;

        public StatusController(IYResourceClient client)
        {
            this.client = client;
        }

        [HttpGet()]
        public async Task<ActionResult<YResource>> Get(string statusUri)
        {
            var resourceResponse = await this.client.UpdateStatusAsync(statusUri);

            return resourceResponse.Value;

        }
    }
}
