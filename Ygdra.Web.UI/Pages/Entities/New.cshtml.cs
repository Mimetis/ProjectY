using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Ygdra.Core.DataSources.Entities;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Entities.Entities;
using Ygdra.Core.Http;
using Ygdra.Core.Payloads;
using Ygdra.Web.UI.Components.BreadCrumb;
using Ygdra.Web.UI.Controllers;
using Ygdra.Web.UI.Models;

namespace Ygdra.Web.UI.Pages.Entities
{
    [Authorize]
    [BreadCrumb(Title = "Entities", Order = 1, Url = "/Entities/Index")]
    [BreadCrumb(Title = "New entity", Order = 2)]
    public class NewModel : PageModel
    {

        private readonly IYHttpRequestHandler client;
        private readonly EnginesController enginesController;
        private readonly DataFactoriesController dataFactoriesController;
        private readonly AzureSqlDatabaseController azureSqlDatabaseController;

        public NewModel(IYHttpRequestHandler client, EnginesController enginesController,
            DataFactoriesController dataFactoriesController, AzureSqlDatabaseController azureSqlDatabaseController)
        {
            this.client = client;
            this.enginesController = enginesController;
            this.dataFactoriesController = dataFactoriesController;
            this.azureSqlDatabaseController = azureSqlDatabaseController;
        }
        public void OnGet()
        {
            // we don't know yet what kind of EntityView we will have at the end of the wizard
            this.EntityView = new EntityViewUnknown 
            {
                IsNew = true,
                Version = "1.0.0"
            };

        }

        [BindProperty]
        public EntityView EntityView { get; set; }

        [BindProperty]
        public int Step { get; set; }

        public async Task<IActionResult> OnGetEnginesAsync()
        {

            var enginesAction = await this.enginesController.GetEnginesAsync();

            if (enginesAction.HasError)
                return enginesAction;

            var engines = enginesAction.Value;
            var engineRequestsView = engines?.Select(er => new EngineView(er)).ToList() ?? new List<EngineView>();

            engineRequestsView = engineRequestsView.Where(erv => erv.Status == YEngineStatus.Deployed).ToList();

            return new YJsonResult<List<EngineView>>(engineRequestsView);
        }

        public async Task<IActionResult> OnGetDataSourcesAsync(Guid engineId, string dataSourceType)
        {
            var dataSourcesAction = await this.dataFactoriesController.GetDataSourcesAsync(engineId);

            if (dataSourcesAction.HasError)
                return dataSourcesAction;

            var dataSources = dataSourcesAction.Value;

            if (!string.IsNullOrEmpty(dataSourceType) && Enum.TryParse<YDataSourceType>(dataSourceType, out var ydt))
                dataSources = dataSources.Where(ds => ds.DataSourceType == ydt).ToList();

            var views = dataSources?.Select(item => new DataSourceViewUnknown(item)).ToList() ?? new List<DataSourceViewUnknown>();

            var enginesAction = await this.enginesController.GetEngineAsync(engineId);

            foreach (var ds in views)
                ds.EngineId = engineId;

            return new YJsonResult<List<DataSourceViewUnknown>>(views);
        }

        public PartialViewResult OnGetEntities(string dvt, Guid engineId)
        {
            EntityView typedEntityView = null;


            if (Enum.TryParse(typeof(YEntityType), dvt, out var t))
                typedEntityView = EntityViewFactory.GetTypedEntityView((YEntityType)t);

            if (typedEntityView == null || typedEntityView.EntityType == YEntityType.None)
                return null;

            typedEntityView.EngineId = engineId;
            typedEntityView.IsNew = true;

            PartialViewResult partial = Partial(typedEntityView.PartialView, typedEntityView);
            partial.ViewData.TemplateInfo.HtmlFieldPrefix = nameof(EntityView);

            return partial;
        }

        public async Task<IActionResult> OnPost()
        {
            if (!ModelState.IsValid)
                return Page();

            try
            {
                await this.client.ProcessRequestApiAsync<YEntity>(
                    $"api/DataFactories/{this.EntityView.EngineId}/links/{this.EntityView.DataSourceName}/entities/{this.EntityView.Name}",
                    null, this.EntityView.Entity, HttpMethod.Put).ConfigureAwait(false);


            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", ex.Message);
                return Page();
            }

            return Redirect("/Entities/Index");

        }
    }
}
