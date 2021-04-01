using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using Ygdra.Core.Auth;
using Ygdra.Core.Engine;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Http;
using Ygdra.Web.UI.Components.BreadCrumb;
using Ygdra.Web.UI.Models;

namespace Ygdra.Web.UI.Pages.Admin
{
    [BreadCrumb(Title = "Landing Zones requests", Order = 1, Url = "/Admin/EnginesRequests")]
    [BreadCrumb(Title = "Request", Order = 2)]
    [Authorize(Roles = "Admin")]
    public class EngineRequestDetailsModel : PageModel
    {
        private readonly IYHttpRequestHandler client;

        public EngineRequestDetailsModel(IYHttpRequestHandler client)
        {
            this.client = client;
        }

        public async Task<IActionResult> OnGetAsync(Guid? id)
        {
            if (!id.HasValue)
                return new NotFoundResult();

            try
            {
                var requestResponse = await this.client.ProcessRequestApiAsync<YEngine>(
                    $"api/Engines/{id}", null).ConfigureAwait(false);

                this.EngineView = new EngineView(requestResponse.Value);

                if (!string.IsNullOrEmpty(this.EngineView.EngineName))
                {
                    this.AddBreadCrumb(new BreadCrumb
                    {
                        Url = this.HttpContext.Request.GetEncodedUrl(),
                        Title = this.EngineView.EngineName,
                        Order = 2
                    });
                }
            }
            catch (Exception ex)
            {
            }

            return Page();
        }

        [BindProperty]
        public EngineView EngineView { get; set; }


    }
}
