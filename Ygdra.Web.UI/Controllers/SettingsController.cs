using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ygdra.Core.Cloud.Entities;
using Ygdra.Core.Http;

namespace Ygdra.Web.UI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SettingsController : YControllerBase
    {
        private readonly IYHttpRequestHandler client;

        public SettingsController(IYHttpRequestHandler client)
        {
            this.client = client;
        }

        [HttpGet()]
        public Task<YJsonResult<YResource>> GetSettingsAsync()
        {
            return YExecuteAsync(async () =>
            {
                var response = await this.client.ProcessRequestApiAsync<YResource>($"api/Settings", null).ConfigureAwait(false);
                return response.Value;
            });
        }
    }
}
