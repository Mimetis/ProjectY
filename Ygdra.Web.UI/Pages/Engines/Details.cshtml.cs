using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Http;
using Ygdra.Web.UI.Components.BreadCrumb;
using Ygdra.Web.UI.Controllers;
using Ygdra.Web.UI.Models;

namespace Ygdra.Web.UI.Pages.Engines
{
    [BreadCrumb(Title = "Landing Zones", Order = 1, Url = "/Engines/Index")]
    [BreadCrumb(Title = "Landing Zone", Order = 2)]
    [Authorize]
    public class DetailsModel : PageModel
    {
        private readonly IYHttpRequestHandler client;
        private readonly EnginesController enginesController;

        public DetailsModel(IYHttpRequestHandler client, EnginesController enginesController)
        {
            this.client = client;
            this.enginesController = enginesController;
        }

        [BindProperty]
        public EngineView EngineView { get; set; }


        public async Task<IActionResult> OnGetAsync(Guid? id)
        {
            if (!id.HasValue)
                return new NotFoundResult();

            var enginesAction = await this.enginesController.GetEngineAsync(id);

            if (enginesAction.HasError)
                return new NotFoundResult();

            this.EngineView = new EngineView(enginesAction.Value);

            if (!string.IsNullOrEmpty(this.EngineView.EngineName))
            {
                this.AddBreadCrumb(new BreadCrumb
                {
                    Url = this.HttpContext.Request.GetEncodedUrl(),
                    Title = this.EngineView.EngineName,
                    Order = 2
                });
            }

            return Page();
        }

    }
}
