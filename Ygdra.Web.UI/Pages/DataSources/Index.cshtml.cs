using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Ygdra.Core.DataSources.Entities;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Http;
using Ygdra.Web.UI.Components.BreadCrumb;
using Ygdra.Web.UI.Models;

namespace Ygdra.Web.UI.Pages.DataSources
{
    [Authorize]
    [BreadCrumb(Title = "Data sources")]
    public class IndexModel : PageModel
    {

        private readonly IYHttpRequestHandler client;

        public IndexModel(IYHttpRequestHandler client)
        {
            this.client = client;
        }

        public async Task<IActionResult> OnGetDataSourcesAsync(string engineId)
        {

            var response = await this.client.ProcessRequestApiAsync<List<YDataSource>>(
                $"api/Datafactories/{engineId}/links").ConfigureAwait(false);
            var all = response.Value;

            var views = all?.Select(item => item.ToTypedDataSourceView()).ToList() ?? new List<DataSourceView>();

            return new JsonResult(views);
        }

        public async Task<IActionResult> OnGetEnginesAsync()
        {

            var response = await this.client.ProcessRequestApiAsync<List<YEngine>>($"api/Engines").ConfigureAwait(false);
            var allEngineRequests = response.Value;

            var engineRequestsView = allEngineRequests?.Select(er => new EngineView(er)).ToList() ?? new List<EngineView>();

            engineRequestsView = engineRequestsView.Where(erv => erv.Status == YEngineStatus.Deployed).ToList();

            return new JsonResult(engineRequestsView);

        }

        public void OnGet()
        {

        }
    }
}
