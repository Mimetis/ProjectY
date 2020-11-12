using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Routing.Tree;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Web;
using Newtonsoft.Json;
using Ygdra.Core.Auth;
using Ygdra.Core.Engine;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Exceptions;
using Ygdra.Core.Http;
using Ygdra.Core.Options;
using Ygdra.Web.UI.Components.BreadCrumb;
using Ygdra.Web.UI.Controllers;
using Ygdra.Web.UI.Models;
using Ygdra.Web.UI.TagHelpers;

namespace Ygdra.Web.UI.Pages.Engines
{
    [Authorize]
    [BreadCrumb(Title = "Engines")]
    public class IndexModel : PageModel
    {
        private readonly IYHttpRequestHandler client;
        private readonly EnginesController enginesController;

        public IndexModel(IYHttpRequestHandler client, EnginesController enginesController)
        {
            this.client = client;
            this.enginesController = enginesController;
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

            return new YJsonResult<List<EngineView>>(engineRequestsView);

        }
    }
}
