using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Ygdra.Core.Auth;
using Ygdra.Web.UI.Components.BreadCrumb;

namespace Ygdra.Web.UI.Pages.Create
{
    [BreadCrumb(Title = "Create")]
    public class IndexModel : PageModel
    {
        private readonly IYAuthProvider authProvider;
        private readonly IHttpClientFactory httpClientFactory;
        private readonly HttpClient httpClient;

        public IndexModel(IYAuthProvider authProvider, IHttpClientFactory httpClientFactory)
        {
            this.authProvider = authProvider;
            this.httpClientFactory = httpClientFactory;
            this.httpClient = this.httpClientFactory.CreateClient();
        }
    }
}
