using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
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
    [BreadCrumb(Title = "Engines requests", Order = 1, Url = "/Admin/EnginesRequests")]
    [BreadCrumb(Title = "Request", Order = 2)]
    [Authorize(Roles = "Admin")]
    public class EditModel : PageModel
    {
        private readonly IYHttpRequestHandler client;

        public EditModel(IYHttpRequestHandler client)
        {
            this.client = client;
        }

        public async Task OnGetAsync(Guid? id)
        {
            if (!id.HasValue)
            {
                this.EngineView = new EngineView();
                return;
            }

            try
            {
                var response = await this.client.ProcessRequestApiAsync<YEngine>($"api/Engines/{id}", null).ConfigureAwait(false);
                this.EngineView = new EngineView(response.Value);


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

                throw;
            }

        }

        [BindProperty]
        public EngineView EngineView { get; set; }



        public async Task<IActionResult> OnPost()
        {
            foreach (var key in ModelState.Keys.Where(k => ModelState[k].Errors.Count > 0 && !this.Request.Form.Keys.Any(ek => ek == k) ))
            {
                ModelState[key].Errors.Clear();
                ModelState[key].ValidationState = ModelValidationState.Valid;
            }

            if (!ModelState.IsValid)
                return Page();

            // get the engine and merge values from POST
            var engineResponse = await this.client.ProcessRequestApiAsync<YEngine>($"api/Engines/{this.EngineView.Engine.Id}", null).ConfigureAwait(false);

            var engine = engineResponse.Value;
            engine.EngineName = this.EngineView.EngineName;
            engine.EngineType = this.EngineView.EngineType;
            engine.Owners = this.EngineView.Engine.Owners;
            engine.Members = this.EngineView.Engine.Members;
            engine.Comments = this.EngineView.Comments;
            engine.Status = this.EngineView.Status;
            engine.AdminComments = this.EngineView.AdminComments;

            await this.client.ProcessRequestApiAsync<YEngine>($"api/Engines/{this.EngineView.Engine.Id}", null, engine, HttpMethod.Put).ConfigureAwait(false);

            return Redirect("/Admin/EnginesRequests");

        }
    }
}
