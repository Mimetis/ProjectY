using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Ygdra.Core.Auth;
using Ygdra.Core.Engine;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Http;
using Ygdra.Core.Options;
using Ygdra.Web.UI.Components.BreadCrumb;
using Ygdra.Web.UI.Controllers;
using Ygdra.Web.UI.Models;
using Ygdra.Web.UI.TagHelpers;

namespace Ygdra.Web.UI.Pages.Engines
{
    [Authorize]
    [BreadCrumb(Title = "Engines", Order = 1, Url = "/Engines/Index")]
    [BreadCrumb(Title = "Engine", Order = 2)]
    public class EditModel : PageModel
    {
        private readonly IYHttpRequestHandler client;
        private readonly EnginesController enginesController;

        public EditModel(IYHttpRequestHandler client, EnginesController enginesController)
        {
            this.client = client;
            this.enginesController = enginesController;
        }

        [BindProperty]
        public EngineView EngineView { get; set; }


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
                Debug.WriteLine(ex.Message);
                throw;
            }

        }

        public async Task<IActionResult> OnPost()
        {
            // Remove all errors from required fields that are not in the Form
            foreach (var key in ModelState.Keys.Where(k => ModelState[k].Errors.Count > 0 && !this.Request.Form.Keys.Any(ek => ek == k)))
            {
                ModelState[key].Errors.Clear();
                ModelState[key].ValidationState = ModelValidationState.Valid;
            }

            if (!ModelState.IsValid)
                return Page();

            try
            {
                YEngine engine;

                // Merge engine from repository with the one we are editing here
                if (!this.EngineView.IsNew)
                {
                    var engineGetAction = await this.enginesController.GetEngineAsync(this.EngineView.Engine.Id).ConfigureAwait(false);

                    if (engineGetAction.HasError)
                        throw new Exception(engineGetAction.Error?.ToString());
                    
                    engine = engineGetAction.Value;
                    engine.EngineName = this.EngineView.EngineName;
                    engine.EngineType = this.EngineView.EngineType;
                    engine.Owners = this.EngineView.Engine.Owners;
                    engine.Members = this.EngineView.Engine.Members;
                    engine.Comments = this.EngineView.Comments;
                }
                else
                {
                    engine = this.EngineView.Engine;
                }

                var saveEngineAction = await this.enginesController.SaveEngineAsync(engine.Id, engine);

                if (saveEngineAction.HasError)
                    throw new Exception(saveEngineAction.Error?.ToString());

                return Redirect("/Engines/Index");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", ex.Message);
                return Page();
            }

        }
    }
}
