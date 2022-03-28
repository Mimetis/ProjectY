using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Ygdra.Core.Auth
{
    public interface IYAuthProvider
    {

        /// <summary>
        /// Get access token  for the confidential client itself (not on behalf of a user) using the client credentials flow to access graph apis
        /// </summary>
        Task<string> GetAccessTokenForAppGraphAsync();

        /// <summary>
        /// Get access token  for the confidential client itself (not on behalf of a user) using the client credentials flow to access graph apis
        /// </summary>
        Task<string> GetAccessTokenForAsync(string ressource);

        /// <summary>
        /// Gets an access token on behalf of the user account to access graph apis
        /// </summary>
        Task<string> GetAccessTokenForUserGraphAsync(IEnumerable<string> scopes = null);

        /// <summary>
        /// Gets an access token on behalf of the user account to access Ygdra apis
        /// </summary>
        Task<string> GetAccessTokenForUserApiAsync(IEnumerable<string> scopes = null);

        /// <summary>
        /// Get access token  for the confidential client itself (not on behalf of a user) using the client credentials flow to access management apis
        /// </summary>
        Task<string> GetAccessTokenForAppManagementAsync();

        /// <summary>
        /// Get access token  for the confidential client itself (not on behalf of a user) using the client credentials flow to access management apis
        /// </summary>
        Task<string> GetAccessTokenForPurviewAsync();

        /// <summary>
        /// Gets Graph scopes from options
        /// </summary>
        IEnumerable<string> GraphScopes { get; }
        
        /// <summary>
        /// Gets Ygdra API scopes from options
        /// </summary>
        IEnumerable<string> ApiScopes { get; }

    }
}
