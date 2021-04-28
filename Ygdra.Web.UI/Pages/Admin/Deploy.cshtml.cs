using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Ygdra.Core.Auth;
using Ygdra.Core.Cloud.Entities;
using Ygdra.Core.Engine;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Exceptions;
using Ygdra.Core.Http;
using Ygdra.Core.Settings;
using Ygdra.Core.Settings.Entities;
using Ygdra.Web.UI.Components.BreadCrumb;
using Ygdra.Web.UI.Controllers;
using Ygdra.Web.UI.Models;

namespace Ygdra.Web.UI.Pages.Admin
{
    [Authorize(Roles = "Admin")]
    [BreadCrumb(Title = "Engine deployment")]

    public class DeployModel : PageModel
    {
        private readonly IYHttpRequestHandler client;
        private readonly EnginesController enginesController;

        public DeployModel(IYHttpRequestHandler client, EnginesController enginesController)
        {
            this.client = client;
            this.enginesController = enginesController;
        }

        public async Task<IActionResult> OnGetAsync(Guid? id)
        {
            if (!id.HasValue)
                return new NotFoundResult();

            var enginesAction = await this.enginesController.GetEngineAsync(id);

            if (enginesAction.HasError)
                return new NotFoundResult();

            var response = await this.client.ProcessRequestApiAsync<List<YSetting>>($"api/Settings").ConfigureAwait(false);
            var settings = response.Value;

            this.EngineView = new EngineView(enginesAction.Value);

            if (settings != null)
            {
                if (string.IsNullOrEmpty(this.EngineView.ResourceGroupName))
                {
                    string prefix = settings.FirstOrDefault(s => s.Name == "ResourceGroupPrefix")?.Value;
                    string suffix = settings.FirstOrDefault(s => s.Name == "ResourceGroupSuffix")?.Value;

                    string name = $"{prefix}{this.EngineView.EngineName}{suffix}";
                    this.EngineView.ResourceGroupName = name;
                }
                if (string.IsNullOrEmpty(this.EngineView.ClusterName))
                {
                    string prefix = settings.FirstOrDefault(s => s.Name == "DatabricksWorkspacePrefix")?.Value;
                    string suffix = settings.FirstOrDefault(s => s.Name == "DatabricksWorkspaceSuffix")?.Value;

                    string name = $"{prefix}{this.EngineView.EngineName}{suffix}";
                    this.EngineView.ClusterName = name;
                }
                if (string.IsNullOrEmpty(this.EngineView.FactoryName))
                {
                    string prefix = settings.FirstOrDefault(s => s.Name == "DataFactoryPrefix")?.Value;
                    string suffix = settings.FirstOrDefault(s => s.Name == "DataFactorySuffix")?.Value;

                    string name = $"{prefix}{this.EngineView.EngineName}{suffix}";
                    this.EngineView.FactoryName = name;
                }
                if (string.IsNullOrEmpty(this.EngineView.KeyVaultName))
                {
                    string prefix = settings.FirstOrDefault(s => s.Name == "KeyVaultPrefix")?.Value;
                    string suffix = settings.FirstOrDefault(s => s.Name == "KeyVaultSuffix")?.Value;

                    string name = $"{prefix}{this.EngineView.EngineName}{suffix}";
                    this.EngineView.KeyVaultName = name;
                }
                if (string.IsNullOrEmpty(this.EngineView.StorageName))
                {
                    string prefix = settings.FirstOrDefault(s => s.Name == "StoragePrefix")?.Value;
                    string suffix = settings.FirstOrDefault(s => s.Name == "StorageSuffix")?.Value;

                    string name = $"{prefix}{this.EngineView.EngineName}{suffix}";
                    this.EngineView.StorageName = name;
                }
                if (string.IsNullOrEmpty(this.EngineView.AppInsightsName))
                {
                    string prefix = settings.FirstOrDefault(s => s.Name == "AppInsightsPrefix")?.Value;
                    string suffix = settings.FirstOrDefault(s => s.Name == "AppInsightsSuffix")?.Value;

                    string name = $"{prefix}{this.EngineView.EngineName}{suffix}";
                    this.EngineView.AppInsightsName = name;
                }

                if (string.IsNullOrEmpty(this.EngineView.Location))
                {
                    string location = settings.FirstOrDefault(s => s.Name == "DefaultLocation")?.Value;
                    this.EngineView.Location = location;
                }
            }
            return Page();


        }

        public async Task<IActionResult> OnPost()
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.Where(v => v.ValidationState == ModelValidationState.Invalid).SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return new JsonResult(errors) { ContentType = "application/json", StatusCode = (int)HttpStatusCode.BadRequest };
            }


            // get the engine and merge values from POST
            var engineResponse = await this.client.ProcessRequestApiAsync<YEngine>($"api/Engines/{this.EngineView.Engine.Id}", null).ConfigureAwait(false);

            var engine = engineResponse.Value;
            engine.EngineName = this.EngineView.EngineName;
            engine.ResourceGroupName = this.EngineView.ResourceGroupName;
            engine.Owners = this.EngineView.Engine.Owners;
            engine.Members = this.EngineView.Engine.Members;
            engine.ClusterName = this.EngineView.ClusterName;
            engine.FactoryName = this.EngineView.FactoryName;
            engine.KeyVaultName = this.EngineView.KeyVaultName;
            engine.StorageName = this.EngineView.StorageName;
            engine.AppInsightsName = this.EngineView.AppInsightsName;
            engine.Location = this.EngineView.Location;

            try
            {
                var res = await this.client.ProcessRequestApiAsync<YEngine>($"api/Engines/{this.EngineView.Engine.Id}", null, engine, HttpMethod.Put).ConfigureAwait(false);
            }
            catch (YWebException ex)
            {
                return new JsonResult(ex.Error) { StatusCode = (int)ex.StatusCode };
            }
            catch (Exception ex)
            {
                return new JsonResult(new JObject { { "message", ex.Message } }) { StatusCode = (int)HttpStatusCode.BadRequest };
            }

            return Page();

        }

        [BindProperty]
        public EngineView EngineView { get; set; }


    }
}
