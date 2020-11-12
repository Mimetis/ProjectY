using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Linq;
using Ygdra.Core.DataSources.Entities;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Http;
using Ygdra.Core.Payloads;
using Ygdra.Web.UI.Components.BreadCrumb;
using Ygdra.Web.UI.Controllers;
using Ygdra.Web.UI.Models;

namespace Ygdra.Web.UI.Pages.DataSources
{
    [Authorize]
    [BreadCrumb(Title = "Data Sources", Order = 1, Url = "/DataSources/Index")]
    [BreadCrumb(Title = "New data source", Order = 2)]
    public class NewModel : PageModel
    {
        private readonly IYHttpRequestHandler client;
        private readonly DataFactoriesController dataFactoriesController;
        private readonly IServiceCollection serviceCollection;
        private readonly ServiceProvider serviProvider;

        public NewModel(IYHttpRequestHandler client, DataFactoriesController dataFactoriesController)
        {
            this.client = client;
            this.dataFactoriesController = dataFactoriesController;
        }

        public void OnGet()
        {

        }


        [BindProperty]
        public DataSourceView DataSourceView { get; set; }

        public PartialViewResult OnGetProperties(Guid engineId, string dvt)
        {
            DataSourceView typedDataSourceView = null;

            if (Enum.TryParse(typeof(YDataSourceType), dvt, out var t))
                typedDataSourceView = DataSourceViewFactory.GetTypedDatSourceView(new YDataSource { DataSourceType = (YDataSourceType)t });

            if (typedDataSourceView == null)
                return null;

            typedDataSourceView.EngineId = engineId;
            PartialViewResult partial = Partial(typedDataSourceView.PartialView, typedDataSourceView);
            partial.ViewData.TemplateInfo.HtmlFieldPrefix = nameof(DataSourceView);

            return partial;
        }

        public async Task<IActionResult> OnGetDataSourcesAsync(string engineId)
        {

            var response = await this.client.ProcessRequestApiAsync<List<YDataSource>>(
                $"api/Datafactories/{engineId}/links").ConfigureAwait(false);
            var all = response.Value;
            var views = all?.Select(item => new DataSourceView(item));
            return new JsonResult(views);

        }

        public async Task<IActionResult> OnGetEnginesAsync()
        {

            var response = await this.client.ProcessRequestApiAsync<List<YEngine>>($"api/Engines").ConfigureAwait(false);
            var engines = response.Value;

            var engineRequestsView = engines?.Select(er => new EngineView(er)).ToList() ?? new List<EngineView>();
            engineRequestsView = engineRequestsView.Where(erv => erv.Status == YEngineStatus.Deployed).ToList();
            return new JsonResult(engineRequestsView);

        }

        public async Task<IActionResult> OnPostCheckDataSourceAsync()
        {
            try
            {
                var isOk = await this.dataFactoriesController.TestAsync(this.DataSourceView.EngineId, this.DataSourceView.Name, this.DataSourceView.dataSource);
                return new JsonResult(isOk);

            }
            catch (Exception ex)
            {
                return new JsonResult(ex.Message);
            }
        }

        public async Task<IActionResult> OnPost()
        {
            if (!ModelState.IsValid)
                return Page();

            await this.client.ProcessRequestApiAsync<JObject>($"api/DataFactories/{this.DataSourceView.EngineId}/links/{this.DataSourceView.Name}",
                null, this.DataSourceView.dataSource, HttpMethod.Put).ConfigureAwait(false);

            return Redirect("/DataSources/Index");


        }
    }
}
