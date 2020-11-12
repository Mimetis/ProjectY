using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Ygdra.Core.Entities.Entities;
using Ygdra.Core.Http;

namespace Ygdra.Web.UI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AzureSqlDatabaseController : YControllerBase
    {
        private readonly IYHttpRequestHandler client;

        public AzureSqlDatabaseController(IYHttpRequestHandler client)
        {
            this.client = client;
        }

        [HttpGet()]
        [Route("{engineId}/{dataSourceName}/tables")]
        public Task<YJsonResult<List<YSqlTable>>> GetAzureSqlDatabaseTablesAsync(Guid engineId, string dataSourceName)
        {
            return YExecuteAsync(async () =>
            {
                var response = await this.client.ProcessRequestApiAsync<List<YSqlTable>>($"api/AzureSqlDatabase/{engineId}/{dataSourceName}/tables",
                    null).ConfigureAwait(false);

                return response.Value;
            });
        }

        [HttpGet()]
        [Route("{engineId}/{dataSourceName}/tables/{schemaName}/{tableName}/columns")]
        public Task<YJsonResult<List<YSqlColumn>>> GetAzureSqlDatabaseColumnsAsync(Guid engineId, string dataSourceName, string schemaName, string tableName)
        {
            return YExecuteAsync(async () =>
            {
                var response = await this.client.ProcessRequestApiAsync<List<YSqlColumn>>($"api/AzureSqlDatabase/{engineId}/{dataSourceName}/tables/{schemaName}/{tableName}/columns",
                    null).ConfigureAwait(false);

                return response.Value;
            });
        }

        [HttpGet()]
        [Route("{engineId}/{dataSourceName}/tables/{schemaName}/{tableName}/preview")]
        public Task<YJsonResult<JArray>> GetAzureSqlDatabasePreviewAsync(Guid engineId, string dataSourceName, string schemaName, string tableName)
        {
            return YExecuteAsync(async () =>
            {
                var response = await this.client.ProcessRequestApiAsync<JArray>($"api/AzureSqlDatabase/{engineId}/{dataSourceName}/tables/{schemaName}/{tableName}/preview",
                    null).ConfigureAwait(false);

                return response.Value;
            });
        }
    }
}
