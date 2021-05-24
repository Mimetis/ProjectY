using Azure.Core;
using Azure.Identity;
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
        static string Authority = "https://login.microsoftonline.com/microsoft.onmicrosoft.com";
        // Graph scopes
        static string[] GraphScopes = new string[] { "user.read" };
        // Ygdra API scope
        static string[] ApiScopes = new string[] { "https://microsoft.onmicrosoft.com/02991530-afbd-44b8-b9c9-8dd49dd5515f/user_impersonation" };


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
        public static async Task<string> GetAccessTokenAsync(string clientId)
        {
            AuthenticationResult result = await GetAuthenticationAsync(clientId);
            // Get user information from id token
            var user = AuthorizationHelper.GetUser(result.IdToken);

            // Just in case, we can see if user is an Admin
            var isAdmin = user.IsInRole("Admin") ? "You are an Admin" : "You are a user";

            return result.AccessToken;
        }

        /// <summary>
        /// Gets an ID token for the specified clientId.
        /// </summary>
        /// <param name="clientId">The AAD App registration's client ID.</param>
        /// <returns></returns>
        public static async Task<ClaimsPrincipal> GetUserClaimsAsync(string clientId)
        {
            AuthenticationResult result = await GetAuthenticationAsync(clientId);
            // Get user information from id token
            var user = AuthorizationHelper.GetUser(result.IdToken);

           
            return user;
        }

        public static async Task<AuthenticationResult> GetAuthenticationAsync(string clientId)
        {
            // Using MASAL to Get access token and id token
            IPublicClientApplication pca = PublicClientApplicationBuilder
                    .Create(clientId)
                    .WithAuthority(Authority)
                    .WithDefaultRedirectUri()
                    .Build();

            // Adding cache helper
            TokenCacheHelper.EnableSerialization(pca.UserTokenCache);

            // Getting the access_token AND id_token
            return await AuthorizationHelper.GetAccessTokenWithMSALAsync(pca, ApiScopes);

        }


        /// <summary>
        /// Get access token and id token from Azure AD
        /// </summary>
        public static async Task<AuthenticationResult> GetAccessTokenWithMSALAsync(IPublicClientApplication pca, string[] scopes)
        {

            var accounts = await pca.GetAccountsAsync();

            // All AcquireToken* methods store the tokens in the cache, so check the cache first
            try
            {
                return await pca.AcquireTokenSilent(scopes, accounts.FirstOrDefault()).ExecuteAsync();
            }
            catch (MsalUiRequiredException ex)
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

                Console.WriteLine(result.Account.Username);
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
        internal static ClaimsPrincipal GetUser(string idToken)
        {
            JsonWebToken jsonWebToken = new JsonWebToken(idToken);
            var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(jsonWebToken.Claims, "Bearer", "preferred_username", "roles"));
            return claimsPrincipal;
        }


        /// <summary>
        /// Get token with Azure.Identity
        /// Easier but unfortunatelly does not work without Admin Consent
        /// </summary>
        static async Task<string> GetAccessTokenWithAzureIdentityAsync(string[] scopes)
        {
            var credential = new DeviceCodeCredential();
            var tokenRequest = new TokenRequestContext(scopes);
            var token = await credential.GetTokenAsync(tokenRequest);

            return token.Token;
        }
    }
}
