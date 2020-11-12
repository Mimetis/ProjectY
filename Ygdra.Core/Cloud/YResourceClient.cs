using Azure.Identity;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Web;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Ygdra.Core.Auth;
using Ygdra.Core.Cloud.Entities;
using Ygdra.Core.Exceptions;
using Ygdra.Core.Http;
using Ygdra.Core.Options;

namespace Ygdra.Core.Cloud
{
    public class YResourceClient : IYResourceClient
    {
        private readonly IYAuthProvider authProvider;
        private readonly IYHttpRequestHandler requestHandler;
        private readonly YMicrosoftIdentityOptions options;

        public YResourceClient(IYAuthProvider authProvider, IYHttpRequestHandler requestHandler, IOptions<YMicrosoftIdentityOptions> options)
        {
            this.authProvider = authProvider;
            this.requestHandler = requestHandler;
            this.options = options.Value;
        }


        /// <summary>
        /// Check if the resource name is available
        /// </summary>
        public async Task<YHttpResponse<JObject>> CheckResourceNameIsAvailableAsync(string resourceName, string provider, string type, string apiversion, CancellationToken cancellationToken = default)
        {
            if (resourceName == null)
                throw new ArgumentNullException(nameof(resourceName));
            if (type == null)
                throw new ArgumentNullException(nameof(type));

            if (provider == null)
                throw new ArgumentNullException(nameof(type));

            if (string.IsNullOrEmpty(this.options?.SubscriptionId))
                throw new ArgumentNullException("SubscriptionId");

            var parameters = new YResource { Name = resourceName, Type = type };

            var fullPath = new Uri($"https://management.azure.com/providers/{provider}/checkNameAvailability?api-version={apiversion}");

            var accessToken = await authProvider.GetAccessTokenForAppManagementAsync();

            var result = await this.requestHandler.ProcessRequestAsync<JObject>(fullPath, parameters, HttpMethod.Post, accessToken, default, cancellationToken);

            return result;

        }

        /// <summary>
        /// Check if the resource name is valid and not a reserved key word
        /// </summary>
        public async Task<YHttpResponse<YResource>> CheckResourceNameIsValidAsync(string resourceName, string type, CancellationToken cancellationToken = default)
        {
            if (resourceName == null)
                throw new ArgumentNullException(nameof(resourceName));
            if (type == null)
                throw new ArgumentNullException(nameof(type));
            if (string.IsNullOrEmpty(this.options?.SubscriptionId))
                throw new ArgumentNullException("SubscriptionId");

            var parameters = new YResource { Name = resourceName, Type = type };
            var fullPath = new Uri("https://management.azure.com/providers/microsoft.resources/checkresourcename?api-version=2015-11-01");
            var accessToken = await authProvider.GetAccessTokenForAppManagementAsync();

            var result = await this.requestHandler.ProcessRequestAsync<YResource>(fullPath, parameters, HttpMethod.Post, accessToken, default, cancellationToken);

            return result;

        }

        public async Task<YHttpResponse<YResource>> CreateOrUpdateAsync(string resourceGroupName, string apiVersion, YResource parameters, CancellationToken cancellationToken = default)
        {
            this.ThrowIfParametersMissing(resourceGroupName, apiVersion);
            var path = this.BuildPath(resourceGroupName);
            var query = this.BuildQuery(apiVersion);

            var result = await this.requestHandler.ProcessRequestManagementAsync<YResource>(path, query, parameters, HttpMethod.Put, cancellationToken);

            return result;

        }


        public async Task<YHttpResponse<YResource>> DeleteAsync(string resourceGroupName, string apiVersion, CancellationToken cancellationToken = default)
        {
            this.ThrowIfParametersMissing(resourceGroupName, apiVersion);
            var path = this.BuildPath(resourceGroupName);
            var query = this.BuildQuery(apiVersion);

            var result = await this.requestHandler.ProcessRequestManagementAsync<YResource>(path, query, null, HttpMethod.Delete, cancellationToken);

            return result;

        }

        public async Task<YHttpResponse<YResource>> GetAsync(string resourceGroupName, string apiVersion, CancellationToken cancellationToken = default)
        {
            try
            {
                this.ThrowIfParametersMissing(resourceGroupName, apiVersion);
                var path = this.BuildPath(resourceGroupName);
                var query = this.BuildQuery(apiVersion);

                var result = await this.requestHandler.ProcessRequestManagementAsync<YResource>(path, query, null, HttpMethod.Get, cancellationToken);

                return result;

            }
            catch
            {
                return YHttpResponse<YResource>.NotFound;
            }

        }


        public async Task<YHttpResponse<YResource>> GetAsync(string resourceGroupName, string resourceProviderNamespace, string parentResourcePath, string resourceType, string resourceName, string apiVersion, CancellationToken cancellationToken = default)
        {
            try
            {

                this.ThrowIfParametersMissing(resourceGroupName, resourceProviderNamespace, parentResourcePath, resourceType, resourceName, apiVersion);
                var path = this.BuildPath(resourceGroupName, resourceProviderNamespace, parentResourcePath, resourceType, resourceName);
                var query = this.BuildQuery(apiVersion);

                var result = await this.requestHandler.ProcessRequestManagementAsync<YResource>(path, query, null, HttpMethod.Get, cancellationToken);

                return result;
            }
            catch
            {
                return YHttpResponse<YResource>.NotFound;
            }


        }

        public async Task<YHttpResponse<YResource>> StartCreateOrUpdateAsync(string resourceGroupName, string resourceProviderNamespace, string parentResourcePath, string resourceType, string resourceName,
                string apiVersion, YResource parameters, CancellationToken cancellationToken = default)
        {
            this.ThrowIfParametersMissing(resourceGroupName, resourceProviderNamespace, parentResourcePath, resourceType, resourceName, apiVersion);

            if (parameters == null)
                throw new ArgumentNullException(nameof(parameters));

            var path = this.BuildPath(resourceGroupName, resourceProviderNamespace, parentResourcePath, resourceType, resourceName);
            var query = this.BuildQuery(apiVersion);

            var result = await this.requestHandler.ProcessRequestManagementAsync<YResource>(path, query, parameters, HttpMethod.Put, cancellationToken);

            return result;

        }


        public async Task<YHttpResponse<YResource>> StartDeleteAsync(string resourceGroupName, string resourceProviderNamespace, string parentResourcePath, string resourceType, string resourceName, string apiVersion, CancellationToken cancellationToken = default)
        {
            this.ThrowIfParametersMissing(resourceGroupName, resourceProviderNamespace, parentResourcePath, resourceType, resourceName, apiVersion);
            var path = this.BuildPath(resourceGroupName, resourceProviderNamespace, parentResourcePath, resourceType, resourceName);
            var query = this.BuildQuery(apiVersion);

            var result = await this.requestHandler.ProcessRequestManagementAsync<YResource>(path, query, null, HttpMethod.Delete, cancellationToken);

            return result;

        }


        public async Task<YHttpResponse<YResource>> UpdateStatusAsync(string updateUri, CancellationToken cancellationToken = default)
        {
            var accessToken = await authProvider.GetAccessTokenForAppManagementAsync();

            var result = await this.requestHandler.ProcessRequestAsync<YResource>(new Uri(updateUri), null, HttpMethod.Get, accessToken, default, cancellationToken);
            return result;


        }


        /// <summary>
        /// Build query
        /// </summary>
        private string BuildQuery(string apiVersion)
        {
            return $"?api-version={apiVersion}";
        }

        /// <summary>
        /// Build mamanegement path
        /// </summary>
        private string BuildPath(string resourceGroupName, string resourceProviderNamespace, string parentResourcePath, string resourceType, string resourceName)
        {
            var pathBuilder = new StringBuilder();
            pathBuilder.Append($"/subscriptions/{this.options.SubscriptionId}");
            pathBuilder.Append($"/resourceGroups/{resourceGroupName}");
            pathBuilder.Append($"/providers/{resourceProviderNamespace}");
            if (!string.IsNullOrEmpty(parentResourcePath))
                pathBuilder.Append($"/{parentResourcePath}");
            if (!string.IsNullOrEmpty(resourceType))
                pathBuilder.Append($"/{resourceType}");
            if (!string.IsNullOrEmpty(resourceName))
                pathBuilder.Append($"/{resourceName}");
            var path = pathBuilder.ToString();
            return path;
        }

        /// <summary>
        /// Check args
        /// </summary>
        private void ThrowIfParametersMissing(string resourceGroupName, string resourceProviderNamespace, string parentResourcePath, string resourceType, string resourceName, string apiVersion)
        {
            if (resourceGroupName == null)
                throw new ArgumentNullException(nameof(resourceGroupName));
            if (resourceProviderNamespace == null)
                throw new ArgumentNullException(nameof(resourceProviderNamespace));
            if (parentResourcePath == null)
                throw new ArgumentNullException(nameof(parentResourcePath));
            if (resourceType == null)
                throw new ArgumentNullException(nameof(resourceType));
            if (resourceName == null)
                throw new ArgumentNullException(nameof(resourceName));
            if (apiVersion == null)
                throw new ArgumentNullException(nameof(apiVersion));
            if (string.IsNullOrEmpty(this.options?.SubscriptionId))
                throw new ArgumentNullException("SubscriptionId");
        }


        private string BuildPath(string resourceGroupName)
        {
            var pathBuilder = new StringBuilder();
            pathBuilder.Append($"/subscriptions/{this.options.SubscriptionId}");
            pathBuilder.Append($"/resourceGroups/{resourceGroupName}");
            var path = pathBuilder.ToString();
            return path;
        }

        private void ThrowIfParametersMissing(string resourceGroupName, string apiVersion)
        {
            if (resourceGroupName == null)
                throw new ArgumentNullException(nameof(resourceGroupName));
            if (apiVersion == null)
                throw new ArgumentNullException(nameof(apiVersion));
            if (string.IsNullOrEmpty(this.options?.SubscriptionId))
                throw new ArgumentNullException("SubscriptionId");
        }
    }
}
