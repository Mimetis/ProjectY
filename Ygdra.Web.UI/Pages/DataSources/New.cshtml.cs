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
            // we don't know yet what kind of DataSource we will have at the end of the wizard
            this.DataSourceView = new DataSourceViewUnknown { IsNew = true };
        }

        [BindProperty]
        public DataSourceView DataSourceView { get; set; }
        
        [BindProperty]
        public int Step { get; set; }

        public PartialViewResult OnGetProperties(Guid engineId, string dvt)
        {
            DataSourceView typedDataSourceView = null;

            if (Enum.TryParse(typeof(YDataSourceType), dvt, out var t))
                typedDataSourceView = DataSourceViewFactory.GetTypedDatSourceView((YDataSourceType)t);

            if (typedDataSourceView == null || typedDataSourceView.DataSourceType == YDataSourceType.None)
                return null;

            typedDataSourceView.EngineId = engineId;
            typedDataSourceView.IsNew = true;

            PartialViewResult partial = Partial(typedDataSourceView.PartialView, typedDataSourceView);
            partial.ViewData.TemplateInfo.HtmlFieldPrefix = nameof(DataSourceView);

            return partial;
        }

        public async Task<IActionResult> OnGetDataSourcesAsync(string engineId)
        {

            var response = await this.client.ProcessRequestApiAsync<List<YDataSource>>(
                $"api/Datafactories/{engineId}/links").ConfigureAwait(false);

            var all = response.Value;
            var views = all?.Select(item => new DataSourceViewUnknown(item));
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

        public async Task<IActionResult> OnPost()
        {
            if (!ModelState.IsValid)
                return Page();

            try
            {
                await this.client.ProcessRequestApiAsync<YDataSourceUnknown>($"api/DataFactories/{this.DataSourceView.EngineId}/links/{this.DataSourceView.Name}",

                    null, this.DataSourceView.DataSource, HttpMethod.Put).ConfigureAwait(false);

            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", ex.Message);
                return Page();
            }


            return Redirect("/DataSources/Index");


        }
    }
}
