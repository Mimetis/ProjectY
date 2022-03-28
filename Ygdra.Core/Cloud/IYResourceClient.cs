using System.Threading;
using System.Threading.Tasks;
using Ygdra.Core.Cloud.Entities;
using Ygdra.Core.Http;

namespace Ygdra.Core.Cloud
{
    public interface IYResourceClient
    {
        Task<YHttpResponse<YResource>> GetAsync(string resourceGroupName, string resourceProviderNamespace, string parentResourcePath, string resourceType, string resourceName, string apiVersion, CancellationToken cancellationToken = default);
        Task<YHttpResponse<T>> GetAsync<T>(string resourceGroupName, string resourceProviderNamespace, string parentResourcePath, string resourceType, string resourceName, string apiVersion, CancellationToken cancellationToken = default);
        Task<YHttpResponse<YResource>> StartCreateOrUpdateAsync(string resourceGroupName, string resourceProviderNamespace, string parentResourcePath, string resourceType, string resourceName, string apiVersion, YResource parameters, CancellationToken cancellationToken = default);
        Task<YHttpResponse<YResource>> StartDeleteAsync(string resourceGroupName, string resourceProviderNamespace, string parentResourcePath, string resourceType, string resourceName, string apiVersion, CancellationToken cancellationToken = default);
        Task<YHttpResponse<YResource>> UpdateStatusAsync(string updateUri, CancellationToken cancellationToken = default);
        Task<YHttpResponse<YResource>> CheckResourceNameIsValidAsync(string resourceName, string type, CancellationToken cancellationToken = default);
        Task<YHttpResponse<YResource>> GetAsync(string resourceGroupName, string apiVersion, CancellationToken cancellationToken = default);
        Task<YHttpResponse<YResource>> CreateOrUpdateAsync(string resourceGroupName, string apiVersion, YResource parameters, CancellationToken cancellationToken = default);
        Task<YHttpResponse<YResource>> DeleteAsync(string resourceGroupName, string apiVersion, CancellationToken cancellationToken = default);


    }
}