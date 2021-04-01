using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Identity.Web.Resource;
using Newtonsoft.Json;
using Ygdra.Core.Auth;
using Ygdra.Core.Engine;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Http;
using Ygdra.Web.UI.Components.BreadCrumb;
using Ygdra.Web.UI.Models;

namespace Ygdra.Web.UI.Pages.Admin
{
    [Authorize(Roles = "Admin")]
    [BreadCrumb(Title = "Landing Zones requests")]
    public class IndexModel : PageModel
    {
        private readonly IYHttpRequestHandler client;

        public IndexModel(IYHttpRequestHandler client)
        {
            this.client = client;
        }


        public async Task<IActionResult> OnGetEnginesAsync()
        {
           
                var response = await this.client.ProcessRequestApiAsync<List<YEngine>>($"api/Engines/All").ConfigureAwait(false);
                var allEngineRequests = response.Value;

                var engineRequestsView = allEngineRequests?.Select(er => new EngineView(er));

                return new JsonResult(engineRequestsView);
           
        }
    }
}
