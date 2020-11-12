using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Identity.Web;
using Ygdra.Core.Http;
using Ygdra.Core.Settings.Entities;
using Ygdra.Web.UI.Components.BreadCrumb;
using Ygdra.Web.UI.Models;

namespace Ygdra.Web.UI.Pages.Settings
{
    [Authorize]
    [BreadCrumb(Title = "Settings")]
    public class IndexModel : PageModel
    {
        private readonly IYHttpRequestHandler client;

        public IndexModel(IYHttpRequestHandler client)
        {
            this.client = client;
        }

        public void OnGet()
        {
        }

        public async Task<IActionResult> OnGetSettingsAsync()
        {

            var response = await this.client.ProcessRequestApiAsync<List<YSetting>>($"api/Settings").ConfigureAwait(false);
            var allSettings = response.Value;

            var settingsView = allSettings?.Select(er => new SettingView(er));
            return new JsonResult(settingsView);

        }
    }
}
