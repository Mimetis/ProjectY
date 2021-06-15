using Azure.Core;
using Azure.Identity;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Client;
using Microsoft.IdentityModel.JsonWebTokens;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Ygdra.Cli.NetCore.Helpers
{
    public class AuthorizationHelper
    {
        // Authority
        static string LoginUrlConstant = "https://login.microsoftonline.com/{0}";

        // API scope
        static string ApiScopesConstant = "https://{0}/{1}/user_impersonation";

        public string ClientId { get; }
        public string Authority { get; }
        public string[] ApiScopes { get; }

        private IPublicClientApplication pca;

        public AuthorizationHelper(string clientId, string domain)
        {
            if (clientId is null)
                throw new ArgumentNullException(nameof(clientId));
            if (domain is null)
                throw new ArgumentNullException(nameof(domain));

            ClientId = clientId;
            Authority = string.Format(LoginUrlConstant, domain);
            ApiScopes = new string[] { string.Format(ApiScopesConstant, domain, clientId) };

            // Using MASAL to Get access token and id token
            pca = PublicClientApplicationBuilder
                    .Create(ClientId)
                    .WithAuthority(Authority)
                    .WithDefaultRedirectUri()
                    .Build();

            // Adding cache helper
            TokenCacheHelper.EnableSerialization(pca.UserTokenCache);

        }

        /// <summary>
        /// Classic deserialize with JSON.NET
        /// </summary>
        static T Deserialize<T>(Stream stream)
        {
            using var sr = new StreamReader(stream);
            using var jtr = new JsonTextReader(sr);

            var serializer = new JsonSerializer
            {
                NullValueHandling = NullValueHandling.Ignore,
                Formatting = Formatting.Indented
            };

            T t = serializer.Deserialize<T>(jtr);

            return t;

        }

        /// <summary>
        /// Gets the access token for the specified clientId and the specific API URI.
        /// </summary>
        /// <param name="clientId">The AAD App registration's client ID.</param>
        /// <returns></returns>
        public async Task<string> GetAccessTokenAsync()
        {
            AuthenticationResult result = await AuthenticateAsync();
            
            // Get user information from id token
            var user = GetUser(result.IdToken);

            // Just in case, we can see if user is an Admin
            var isAdmin = user.IsInRole("Admin") ? "You are an Admin" : "You are a user";

            return result.AccessToken;
        }

        /// <summary>
        /// Gets an ID token for the specified clientId.
        /// </summary>
        /// <param name="clientId">The AAD App registration's client ID.</param>
        /// <returns></returns>
        public async Task<ClaimsPrincipal> GetUserClaimsAsync()
        {
            AuthenticationResult result = await AuthenticateAsync();
            
            // Get user information from id token
            var user = GetUser(result.IdToken);
           
            return user;
        }

        public async Task<AuthenticationResult> AuthenticateAsync()
        {
            // Getting the access_token AND id_token
            return await GetAccessTokenWithMSALAsync(pca, ApiScopes);
        }


        /// <summary>
        /// Get access token and id token from Azure AD
        /// </summary>
        public async Task<AuthenticationResult> GetAccessTokenWithMSALAsync(IPublicClientApplication pca, string[] scopes)
        {

            var accounts = await pca.GetAccountsAsync();

            // All AcquireToken* methods store the tokens in the cache, so check the cache first
            try
            {
                return await pca.AcquireTokenSilent(scopes, accounts.FirstOrDefault()).ExecuteAsync();
            }
            catch (MsalUiRequiredException)
            {
                // No token found in the cache or AAD insists that a form interactive auth is required (e.g. the tenant admin turned on MFA)
                // If you want to provide a more complex user experience, check out ex.Classification 
                return await AcquireByDeviceCodeAsync(pca, scopes);
            }
        }


        /// <summary>
        /// Get token through device code
        /// </summary>
        static async Task<AuthenticationResult> AcquireByDeviceCodeAsync(IPublicClientApplication pca, string[] scopes)
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

        /// <summary>
        /// Get user info from id token
        /// </summary>
        internal ClaimsPrincipal GetUser(string idToken)
        {
            JsonWebToken jsonWebToken = new JsonWebToken(idToken);
            var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(jsonWebToken.Claims, "Bearer", "preferred_username", "roles"));
            return claimsPrincipal;
        }


        ///// <summary>
        ///// Get token with Azure.Identity
        ///// Easier but unfortunatelly does not work without Admin Consent
        ///// </summary>
        //static async Task<string> GetAccessTokenWithAzureIdentityAsync(string[] scopes)
        //{
        //    var credential = new DeviceCodeCredential();
        //    var tokenRequest = new TokenRequestContext(scopes);
        //    var token = await credential.GetTokenAsync(tokenRequest);

        //    return token.Token;
        //}
    }
}
