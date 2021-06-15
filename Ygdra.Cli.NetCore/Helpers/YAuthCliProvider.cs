using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ygdra.Core.Auth;
using Ygdra.Core.Options;

namespace Ygdra.Cli.NetCore.Helpers
{
    public class YAuthCliProvider : IYAuthProvider
    {
        static string LoginUrlConstant = "https://login.microsoftonline.com/{0}";

        private IPublicClientApplication pca;

        public YMicrosoftIdentityOptions AzureAdOptions { get; }

        public YAuthCliProvider(IOptions<YMicrosoftIdentityOptions> azureAdOptions)
        {
            this.AzureAdOptions = azureAdOptions.Value;

            var authority = string.Format(LoginUrlConstant, AzureAdOptions.Domain);

            // Using MASAL to Get access token and id token
            this.pca = PublicClientApplicationBuilder
                    .Create(AzureAdOptions.ClientId)
                    .WithAuthority(authority)
                    .WithDefaultRedirectUri()
                    .Build();

            // Adding cache helper
            TokenCacheHelper.EnableSerialization(pca.UserTokenCache);

        }

        public IEnumerable<string> GraphScopes => new string[] { "User.Read", "User.ReadBasic.All" };
        public IEnumerable<string> ApiScopes => new string[] { "user_impersonation" };


        public Task<string> GetAccessTokenForAppGraphAsync() => throw new NotImplementedException();

        public Task<string> GetAccessTokenForAppManagementAsync() => throw new NotImplementedException();

        public Task<string> GetAccessTokenForAsync(string ressource) => throw new NotImplementedException();


        public async Task<string> GetAccessTokenForUserApiAsync(IEnumerable<string> scopes = null)
        {
            var accounts = await pca.GetAccountsAsync();
            AuthenticationResult authenticationResult;

            if (scopes == null)
            {
                // Generate the scope, concat of Domain/ClientId/ScopeName
                scopes = new List<string>();

                foreach (var apiScope in this.ApiScopes)
                {
                    string scope = $"https://{AzureAdOptions.Domain}/{AzureAdOptions.ClientId}/{apiScope}";
                    ((List<string>)scopes).Add(scope);
                }
            }

            try
            {
                authenticationResult = await pca.AcquireTokenSilent(scopes, accounts.FirstOrDefault()).ExecuteAsync();
            }
            catch (MsalUiRequiredException)
            {
                authenticationResult = await AcquireByDeviceCodeAsync(pca, scopes);
            }


            return authenticationResult.AccessToken;
        }

        public async Task<string> GetAccessTokenForUserGraphAsync(IEnumerable<string> scopes = null)
        {
            var accounts = await pca.GetAccountsAsync();
            AuthenticationResult authenticationResult;

            if (scopes == null)
                scopes = this.GraphScopes;

            try
            {
                authenticationResult = await pca.AcquireTokenSilent(scopes, accounts.FirstOrDefault()).ExecuteAsync();
            }
            catch (MsalUiRequiredException)
            {
                authenticationResult = await AcquireByDeviceCodeAsync(pca, scopes);
            }


            return authenticationResult.AccessToken;
        }

        /// <summary>
        /// Get token through device code
        /// </summary>
        static async Task<AuthenticationResult> AcquireByDeviceCodeAsync(IPublicClientApplication pca, IEnumerable<string> scopes)
        {
            try
            {
                var result = await pca.AcquireTokenWithDeviceCode(scopes,
                    deviceCodeResult =>
                    {
                        Console.WriteLine(deviceCodeResult.Message);
                        return Task.FromResult(0);
                    }).ExecuteAsync();

                return result;
            }
            // TODO: handle or throw all these exceptions
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }
    }
}
