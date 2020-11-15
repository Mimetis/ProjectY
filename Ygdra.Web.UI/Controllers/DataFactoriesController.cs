using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Ygdra.Core.Cloud.Entities;
using Ygdra.Core.DataSources.Entities;
using Ygdra.Core.Entities.Entities;
using Ygdra.Core.Http;
using Ygdra.Core.Payloads;
using Ygdra.Web.UI.Models;

namespace Ygdra.Web.UI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DataFactoriesController : YControllerBase
    {
        private readonly IYHttpRequestHandler client;

        public DataFactoriesController(IYHttpRequestHandler client)
        {
            this.client = client;
        }

        [HttpPut()]
        [Route("{engineId}/links/{dataSourceName}")]
        public Task<YJsonResult<YDataSourceUnknown>> AddDataSourceAsync(Guid engineId, string dataSourceName, [FromBody] YDataSource payload)
        {
            return YExecuteAsync(async () =>
            {
                var response = await this.client.ProcessRequestApiAsync<YDataSourceUnknown>($"api/DataFactories/{engineId}/links/{dataSourceName}",
                    null, payload, HttpMethod.Put).ConfigureAwait(false);

                return response.Value;
            });
        }

        [HttpGet()]
        [Route("{engineId}")]
        public Task<YJsonResult<YResource>> GetDataFactoryAsync(Guid engineId)
        {
            return YExecuteAsync(async () =>
            {
                var response = await this.client.ProcessRequestApiAsync<YResource>($"api/DataFactories/{engineId}", null).ConfigureAwait(false);
                return response.Value;
            });

        }

        [HttpGet()]
        [Route("{engineId}/entities")]
        public Task<YJsonResult<List<YEntityUnknown>>> GetEntitiesAsync(Guid engineId)
        {
            return YExecuteAsync(async () =>
            {
                var response = await this.client.ProcessRequestApiAsync<List<YEntityUnknown>>($"api/DataFactories/{engineId}/entities", null).ConfigureAwait(false);
                return response.Value;
            });

        }

        [HttpGet()]
        [Route("{engineId}/links")]
        public Task<YJsonResult<List<YDataSourceUnknown>>> GetDataSourcesAsync(Guid engineId, string dataSourceType = null)
        {
            return YExecuteAsync(async () =>
            {
                var response = await this.client.ProcessRequestApiAsync<List<YDataSourceUnknown>>($"api/DataFactories/{engineId}/links", null).ConfigureAwait(false);
                var dataSources = response.Value;

                if (!string.IsNullOrEmpty(dataSourceType) && Enum.TryParse<YDataSourceType>(dataSourceType, out var ydt))
                    dataSources = dataSources.Where(ds => ds.DataSourceType == ydt).ToList();

                return dataSources;
            });

        }


        [HttpPut]
        [Route("{engineId}/links/{dataSourceName}/entities/{entityName}")]
        public Task<YJsonResult<YEntityUnknown>> AddEntityAsync(Guid engineId, string dataSourceName, string entityName, [FromBody] YEntity payload)
        {
            return YExecuteAsync(async () =>
            {

                var response = await this.client.ProcessRequestApiAsync<YEntityUnknown>(
                    $"api/DataFactories/{engineId}/links/{dataSourceName}/entities/{entityName}",
                    null, payload, HttpMethod.Put).ConfigureAwait(false);

                var entity = response.Value;

                return entity;
            });
        }


        //[HttpPost()]
        //[Route("{engineId}/links/{dataSourceName}/test")]
        //public Task<YJsonResult<bool>> TestAsync(Guid engineId, string dataSourceName, [FromBody] YDataSource dataSource)
        //{
        //    return YExecuteAsync(async () =>
        //    {
        //        var response = await this.client.ProcessRequestApiAsync<bool>(
        //            $"api/DataFactories/{engineId}/links/{dataSourceName}/test",
        //            null, dataSource, HttpMethod.Post).ConfigureAwait(false);

        //        return response.Value;
        //    });
        //}

        [HttpPost()]
        [Route("{engineId}/test")]
        public Task<YJsonResult<bool>> TestAsync(Guid engineId, [FromForm] DataSourceView dataSourceView)
        {
            return YExecuteAsync(async () =>
            {
                var response = await this.client.ProcessRequestApiAsync<bool>(
                    $"api/DataFactories/{engineId}/test",
                    null, dataSourceView.DataSource, HttpMethod.Post).ConfigureAwait(false);

                return response.Value;
            });
        }
    }
}
