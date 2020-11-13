using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Http;
using Ygdra.Web.UI.Components.BreadCrumb;
using Ygdra.Web.UI.Controllers;
using Ygdra.Web.UI.Models;

namespace Ygdra.Web.UI.Pages.Entities
{
    [Authorize]
    [BreadCrumb(Title = "Entities")]
    public class IndexModel : PageModel
    {
        private IYHttpRequestHandler client;
        private EnginesController enginesController;
        private readonly DataFactoriesController dataFactoriesController;

        public IndexModel(IYHttpRequestHandler client, EnginesController enginesController, DataFactoriesController dataFactoriesController)
        {
            this.client = client;
            this.enginesController = enginesController;
            this.dataFactoriesController = dataFactoriesController;
        }

        public void OnGet()
        {
        }

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
        public async Task<IActionResult> OnGetEntitiesAsync(Guid engineId)
        {

            var entitiesAction = await this.dataFactoriesController.GetEntitiesAsync(engineId);

            if (entitiesAction.HasError)
                return entitiesAction;

            var entities = entitiesAction.Value;
            var entitiesView = entities?.Select(er => er.ToTypedEntityView()).ToList() ?? new List<EntityView>();

            return new JsonResult(entitiesView);
        }

    }
}
