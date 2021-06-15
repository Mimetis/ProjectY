using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.Graph;
using Microsoft.Identity.Client;
using Microsoft.Identity.Web;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Ygdra.Core.Options;

namespace Ygdra.Core.Auth
{
    /// <summary>
    /// Auth provider giving token for Ygdra API, Graph API and Management API
    /// </summary>
    public class YAuthProvider : IYAuthProvider, IAuthenticationProvider
    {
        public YAuthProvider(ITokenAcquisition tokenAcquisition, IHttpContextAccessor httpContextAccessor, IHttpClientFactory httpClientFactory,
            IOptions<YGraphOptions> graphOptions,
            IOptions<YHostOptions> apiOptions,
            IOptions<YMicrosoftIdentityOptions> azureAdOptions)
        {
            this.TokenAcquisition = tokenAcquisition;
            this.HttpContextAccessor = httpContextAccessor;
            this.HttpClientFactory = httpClientFactory;
            this.GraphOptions = graphOptions.Value;
            this.ApiOptions = apiOptions.Value;
            this.AzureAdOptions = azureAdOptions;
        }

        public ITokenAcquisition TokenAcquisition { get; }
        public IHttpContextAccessor HttpContextAccessor { get; }
        public IHttpClientFactory HttpClientFactory { get; }
        public YGraphOptions GraphOptions { get; }
        public YHostOptions ApiOptions { get; }
        public IOptions<YMicrosoftIdentityOptions> AzureAdOptions { get; }

        /// <summary>
        /// Gets graph scopes from the options, without already MSAL included ones
        /// </summary>
        public IEnumerable<string> GraphScopes => this.GraphOptions.GetScopes().Except(new string[] { "openid", "profile", "offline_access" });

        /// <summary>
        /// Gets API scopes from the options
        /// </summary>
        public IEnumerable<string> ApiScopes => this.ApiOptions.GetScopes();

        /// <summary>
        /// Get access token for a confidential application or daemon (not on behalf of a user) using the client credentials flow to access graph apis
        /// </summary>
        public async Task<string> GetAccessTokenForAppGraphAsync()
        {

            var token = await this.TokenAcquisition.GetAccessTokenForAppAsync("https://graph.microsoft.com/.default").ConfigureAwait(false);
            return token;
        }

        /// <summary>
        /// Get access token  for the confidential client itself (not on behalf of a user) using the client credentials flow to access management apis
        /// </summary>
        public async Task<string> GetAccessTokenForAppManagementAsync()
        {

            var token = await this.TokenAcquisition.GetAccessTokenForAppAsync("https://management.azure.com/.default").ConfigureAwait(false);
            return token;
        }

        /// <summary>
        /// Gets an access token on behalf of the user account to access graph apis
        /// </summary>
        public async Task<string> GetAccessTokenForUserGraphAsync(IEnumerable<string> scopes = null)
        {
            var userClaims = this.HttpContextAccessor.HttpContext.User;

            if (scopes == null)
                scopes = this.GraphScopes;

            var token = await this.TokenAcquisition.GetAccessTokenForUserAsync(scopes, user: userClaims);
            return token;
        }

        /// <summary>
        /// Gets an access token on behalf of the user account to access Ygdra apis
        /// </summary>
        public async Task<string> GetAccessTokenForUserApiAsync(IEnumerable<string> scopes = null)
        {
            var userClaims = this.HttpContextAccessor.HttpContext.User;

            if (scopes == null)
            {
                // Generate the scope, concat of Domain/ClientId/ScopeName
                scopes = new List<string>();
                var aadOption = this.AzureAdOptions.Value;

                foreach (var apiScope in this.ApiScopes)
                {
                    string scope = $"https://{aadOption.Domain}/{aadOption.ClientId}/{apiScope}";
                    ((List<string>)scopes).Add(scope);
                }
            }

            var tokenProd = await this.TokenAcquisition.GetAuthenticationResultForUserAsync(scopes, user: userClaims);
            return tokenProd.AccessToken;
        }

        public async Task<string> GetAccessTokenForAsync(string ressource)
        {
            var token = await this.TokenAcquisition.GetAccessTokenForAppAsync(ressource);
            return token;
        }

        /// <summary>
        /// this method is mainly used by the GraphServiceClient to authenticate all its requests
        /// </summary>
        public async Task AuthenticateRequestAsync(HttpRequestMessage request)
        {
            var token = await this.GetAccessTokenForUserGraphAsync();
            request.Headers.Add("Authorization", $"Bearer {token}");

        }

    }
}
