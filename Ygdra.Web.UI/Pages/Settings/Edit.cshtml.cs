using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Ygdra.Core.Http;
using Ygdra.Core.Settings.Entities;
using Ygdra.Web.UI.Components.BreadCrumb;
using Ygdra.Web.UI.Models;

namespace Ygdra.Web.UI.Pages.Settings
{
    [Authorize]
    [BreadCrumb(Title = "Settings", Order = 1, Url = "/Settings/Index")]
    [BreadCrumb(Title = "Setting", Order = 2)]
    public class EditModel : PageModel
    {
        private readonly IYHttpRequestHandler client;

        public EditModel(IYHttpRequestHandler client)
        {
            this.client = client;
        }

        [BindProperty]
        public SettingView SettingView { get; set; }


        public YDatabricksClusterNodeTypeSettingTypes YDatabricksClusterNodeTypeSettingTypes { get; set; }


        public async Task OnGetAsync(Guid? id)
        {
            if (!id.HasValue)
            {
                this.SettingView = new SettingView();
                return;
            }

            try
            {
                var response = await this.client.ProcessRequestApiAsync<YSetting>($"api/Settings/{id}", null).ConfigureAwait(false);
                this.SettingView = new SettingView(response.Value);

                if (!string.IsNullOrEmpty(this.SettingView.Name))
                {
                    this.AddBreadCrumb(new BreadCrumb
                    {
                        Url = this.HttpContext.Request.GetEncodedUrl(),
                        Title = this.SettingView.Name,
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
            if (!ModelState.IsValid)
                return Page();

            await this.client.ProcessRequestApiAsync<YSetting>($"api/Settings/{this.SettingView.Setting.Id}", null, this.SettingView.Setting, HttpMethod.Put).ConfigureAwait(false);

            return Redirect("/Settings/Index");

        }
    }
}
