﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Ygdra.Core.Cloud.Entities;
using Ygdra.Core.Http;

namespace Ygdra.Web.UI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class StoragesController : YControllerBase
    {
        private readonly IYHttpRequestHandler client;

        public StoragesController(IYHttpRequestHandler client)
        {
            this.client = client;
        }

        [HttpGet()]
        [Route("{engineId}/{dataSourceName}/files")]
        public Task<YJsonResult<JArray>> GetStoragesAsync(Guid engineId, string dataSourceName)
        {
            return YExecuteAsync(async () =>
            {
                var response = await this.client.ProcessRequestApiAsync<JArray>($"api/Storages/{engineId}/{dataSourceName}/files", null).ConfigureAwait(false);
                return response.Value;
            });
        }
    }
}
