using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Ygdra.Core.Auth;
using Ygdra.Core.Exceptions;
using Ygdra.Core.Options;

namespace Ygdra.Core.Http
{
    public class YHttpRequestHandler : IYHttpRequestHandler
    {
        private readonly IYAuthProvider authProvider;
        private readonly IHttpClientFactory httpClientFactory;
        private readonly YGraphOptions graphOptions;
        private readonly YHostOptions apiOptions;
        private readonly YMicrosoftIdentityOptions azureAdOptions;


        public YHttpRequestHandler(IYAuthProvider authProvider, IHttpClientFactory httpClientFactory,
            IOptions<YGraphOptions> graphOptions,
            IOptions<YHostOptions> apiOptions,
            IOptions<YMicrosoftIdentityOptions> azureAdOptions)
        {
            this.authProvider = authProvider;
            this.httpClientFactory = httpClientFactory;
            this.graphOptions = graphOptions.Value;
            this.apiOptions = apiOptions.Value;
            this.azureAdOptions = azureAdOptions.Value;

        }

        /// <summary>
        /// Return an authenticated HttpClient with base address for management and Bearer token set in the headers, used by a confidential application or daemon (not on behalf of a user) using the client credentials flow to access resources management apis
        /// </summary>
        public async Task<YHttpResponse<U>> ProcessRequestManagementAsync<U>(string pathUri, string query = null, object data = null, HttpMethod method = default, CancellationToken cancellationToken = default)
        {
            var accessToken = await this.authProvider.GetAccessTokenForAppManagementAsync().ConfigureAwait(false);
            var baseUri = "https://management.azure.com/.default";
            return await ProcessRequestAsync<U>(BuildUri(pathUri, query, baseUri), data, method, accessToken, default, cancellationToken).ConfigureAwait(false);
        }

        /// <summary>
        /// Return an authenticated HttpClient with base address from graph options and Bearer token set in the headers, used on behalf of the user account to access Graph apis
        /// </summary>
        public async Task<YHttpResponse<U>> ProcessRequestGraphAsync<U>(string pathUri, string query = null, object data = null, HttpMethod method = default, IEnumerable<string> scopes = null, CancellationToken cancellationToken = default)
        {
            var accessToken = await this.authProvider.GetAccessTokenForUserGraphAsync(scopes).ConfigureAwait(false);
            var baseUri = this.graphOptions.BaseAddress;
            return await ProcessRequestAsync<U>(BuildUri(pathUri, query, baseUri), data, method, accessToken, default, cancellationToken).ConfigureAwait(false);
        }

        /// <summary>
        /// Return an authenticated HttpClient with base address from api options and Bearer token set in the headers, used on behalf of the user account to access Ygdra apis
        /// </summary>
        public async Task<YHttpResponse<U>> ProcessRequestApiAsync<U>(string pathUri, string query = null, object data = null, HttpMethod method = default, IEnumerable<string> scopes = null, CancellationToken cancellationToken = default)
        {

            var accessToken = await this.authProvider.GetAccessTokenForUserApiAsync(scopes).ConfigureAwait(false);
            var baseUri = this.apiOptions.BaseAddress;
            return await ProcessRequestAsync<U>(BuildUri(pathUri, query, baseUri), data, method, accessToken, default, cancellationToken).ConfigureAwait(false);
        }


        private Uri BuildUri(string pathUri, string query = default, string baseUri = default)
        {
            var uriBuilder = !string.IsNullOrEmpty(baseUri) ? new UriBuilder(baseUri) : new UriBuilder();
            uriBuilder.Path = pathUri;

            if (!string.IsNullOrEmpty(query))
                uriBuilder.Query = query;

            return uriBuilder.Uri;
        }

        /// <summary>
        /// Send a request and get back a response. Optionally you can add a bearer token
        /// </summary>
        public async Task<YHttpResponse<U>> ProcessRequestAsync<U>(Uri uri, object data = null,
            HttpMethod method = default, string accessToken = default, Dictionary<string, string> headers = default, CancellationToken cancellationToken = default)
        {

            HttpResponseMessage response = null;
            try
            {

                var httpClient = this.httpClientFactory.CreateClient();

                IYHttpSerializer serializer = new YHttpSerializer();

                var responseValue = default(U);

                // set default values for method if not provided
                if (method == default && data == null)
                    method = HttpMethod.Get;
                else if (method == default && data != null)
                    method = HttpMethod.Post;

                using var requestMessage = new HttpRequestMessage(method, uri);

                if (data != null)
                {
                    if (method == HttpMethod.Get)
                        throw new ArgumentException("Cant send a Get request with a body");

                    // get byte array content
                    var binaryData = await serializer.SerializeAsync(data);

                    var arrayContent = new ByteArrayContent(binaryData);
                    arrayContent.Headers.Add("Content-Type", "application/json");

                    requestMessage.Content = arrayContent;
                }


                if (!string.IsNullOrEmpty(accessToken))
                {
                    httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                }

                if (headers != null && headers.Count > 0)
                    foreach (var header in headers)
                        requestMessage.Headers.Add(header.Key, header.Value);

                if (cancellationToken.IsCancellationRequested)
                    cancellationToken.ThrowIfCancellationRequested();

                // Eventually, send the request
                response = await httpClient.SendAsync(requestMessage, cancellationToken).ConfigureAwait(false);

                var yResponse = new YHttpResponse<U> { StatusCode = response.StatusCode };

                response.EnsureSuccessStatusCode();

                if (cancellationToken.IsCancellationRequested)
                    cancellationToken.ThrowIfCancellationRequested();

                yResponse.Headers = this.GetHeaders(response);

                if (response.Content != null)
                {
                    using var streamResponse = await response.Content.ReadAsStreamAsync().ConfigureAwait(false);

                    if (streamResponse.CanRead && streamResponse.Length > 0)
                        responseValue = await serializer.DeserializeAsync<U>(streamResponse);

                    yResponse.Value = responseValue;

                }

                return yResponse;
            }
            catch (Exception ex)
            {
                if (response == null || response.Content == null)
                    throw new YWebException(ex);

                var errorResponseText = await response.Content.ReadAsStringAsync().ConfigureAwait(false);

                var ywebException = new YWebException(ex, errorResponseText, response.StatusCode);
                
                throw ywebException;
            }
        }


        /// <summary>
        /// Get headers
        /// </summary>
        private Dictionary<string, string> GetHeaders(HttpResponseMessage responseMessage)
        {
            var d = new Dictionary<string, string>();

            if (responseMessage.Headers != null)
                foreach (KeyValuePair<string, IEnumerable<string>> header in responseMessage.Headers)
                    d.Add(header.Key, string.Join(",", header.Value));

            if (responseMessage.Content?.Headers != null)
                foreach (KeyValuePair<string, IEnumerable<string>> header in responseMessage.Content.Headers)
                    d.Add(header.Key, string.Join(",", header.Value));

            return d;
        }
    }
}
