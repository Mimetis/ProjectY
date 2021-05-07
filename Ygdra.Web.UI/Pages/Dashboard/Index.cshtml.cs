using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Ygdra.Core.Auth;
using Ygdra.Core.Cloud;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Http;
using Ygdra.Core.Options;
using Ygdra.Core.Services;
using Ygdra.Web.UI.TagHelpers;

namespace Ygdra.Web.UI.Pages.Dashboard
{
    [AllowAnonymous]
    public class IndexModel : PageModel
    {
        private readonly IYAuthProvider authProvider;
        private readonly IHttpClientFactory httpClientFactory;
        private readonly IConfiguration configuration;
        private readonly IYHttpRequestHandler client;
        private readonly IYResourceClient resourceClient;
        private readonly HttpClient httpClient;
        private readonly YMicrosoftIdentityOptions options;

        public IndexModel(IYAuthProvider authProvider, IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            IYHttpRequestHandler client, IYResourceClient resourceClient, IOptions<YMicrosoftIdentityOptions> azureAdOptions)
        {
            this.authProvider = authProvider;
            this.httpClientFactory = httpClientFactory;
            this.configuration = configuration;
            this.client = client;
            this.resourceClient = resourceClient;
            this.httpClient = this.httpClientFactory.CreateClient();
            this.options = azureAdOptions.Value;
        }

        public async Task OnGetAsync()
        {
        }

        public async Task OnPostAsync()
        {
        }


    }
}
