using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json.Linq;
using Ygdra.Core.Http;
using Ygdra.Core.Pipelines.Entities;
using Ygdra.Web.UI.Components.BreadCrumb;
using Ygdra.Web.UI.Controllers;
using Ygdra.Web.UI.Models;

namespace Ygdra.Web.UI.Pages.Entities
{
    [BreadCrumb(Title = "Entities", Order = 1, Url = "/Entities/Index")]
    [BreadCrumb(Title = "Entity", Order = 2)]
    [Authorize]
    public class DetailsModel : PageModel
    {
        private readonly IYHttpRequestHandler client;
        private readonly DataFactoriesController dataFactoriesController;

        public DetailsModel(IYHttpRequestHandler client, DataFactoriesController dataFactoriesController)
        {
            this.client = client;
            this.dataFactoriesController = dataFactoriesController;
        }

        [BindProperty]
        public EntityView EntityView { get; set; }



        public async Task<IActionResult> OnGetAsync(Guid? id, string entityName)
        {
            if (!id.HasValue || string.IsNullOrEmpty(entityName))
                return new NotFoundResult();

            var entityAction = await this.dataFactoriesController.GetEntityAsync(id.Value, entityName);

            if (entityAction.HasError)
                return new NotFoundResult();

            var entityView = new EntityViewUnknown(entityAction.Value);

            this.EntityView = entityView.ToTypedEntityView(entityView.EntityType);
            this.EntityView.IsNew = false;
            this.EntityView.EngineId = id.Value;

            return Page();
        }

        public async Task<IActionResult> OnGetPipelinesAsync(Guid? engineId, string datasourceName, string entityName)
        {
            if (!engineId.HasValue || string.IsNullOrEmpty(entityName) || string.IsNullOrEmpty(datasourceName))
                return new NotFoundResult();

            var pipelinesAction = await this.dataFactoriesController.GetPipelinesAsync(engineId.Value, datasourceName, entityName);

            if (pipelinesAction.HasError)
                return pipelinesAction;

            var pipelines = pipelinesAction.Value;

            var pipelinesView = new List<PipelineView>();

            foreach(var pipeline in pipelines)
            {
                var pipelineView = new PipelineView(pipeline, datasourceName, entityName);
                pipelinesView.Add(pipelineView);
            }

            return new YJsonResult<List<PipelineView>>(pipelinesView);
        }

    }
}
