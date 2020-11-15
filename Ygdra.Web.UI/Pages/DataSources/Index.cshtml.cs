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
using Ygdra.Web.UI.Controllers;
using Ygdra.Web.UI.Models;

namespace Ygdra.Web.UI.Pages.DataSources
{
    [Authorize]
    [BreadCrumb(Title = "Data sources")]
    public class IndexModel : PageModel
    {

        private readonly IYHttpRequestHandler client;
        private readonly DataFactoriesController dataFactoriesController;
        private readonly EnginesController enginesController;

        public IndexModel(IYHttpRequestHandler client, DataFactoriesController dataFactoriesController, EnginesController enginesController)
        {
            this.client = client;
            this.dataFactoriesController = dataFactoriesController;
            this.enginesController = enginesController;
        }

        public async Task<IActionResult> OnGetDataSourcesAsync(string engineId)
        {
            var all = await dataFactoriesController.GetDataSourcesAsync(Guid.Parse(engineId)).ConfigureAwait(false); ;


            if (!all.HasError)
            {
                var views = all.Value?.Select(item => item.ToTypedDataSourceView()).ToList() ?? new List<DataSourceView>();
                return new JsonResult(views);
            }

            return new JsonResult(null);

        }

        public async Task<IActionResult> OnGetEnginesAsync()
        {

            var allEngineRequests = await this.enginesController.GetEnginesAsync().ConfigureAwait(false);

            if (!allEngineRequests.HasError)
            {

                var engineRequestsView = allEngineRequests.Value?.Select(er => new EngineView(er)).ToList() ?? new List<EngineView>();

                engineRequestsView = engineRequestsView.Where(erv => erv.Status == YEngineStatus.Deployed).ToList();

                return new JsonResult(engineRequestsView);

            }

            return new JsonResult(null);

        }

        public void OnGet()
        {

        }
    }
}
