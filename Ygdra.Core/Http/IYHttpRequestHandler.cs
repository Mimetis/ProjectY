using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace Ygdra.Core.Http
{
    public interface IYHttpRequestHandler
    {
        Task<YHttpResponse<U>> ProcessRequestAsync<U>(Uri uri, object data = null, HttpMethod method = null, string accessToken = null, Dictionary<string, string> headers = default, CancellationToken cancellationToken = default);

        Task<YHttpResponse<U>> ProcessRequestApiAsync<U>(string pathUri, string query = null, object data = null, HttpMethod method = null, IEnumerable<string> scopes = null, CancellationToken cancellationToken = default);
        Task<YHttpResponse<U>> ProcessRequestGraphAsync<U>(string pathUri, string query = null, object data = null, HttpMethod method = null, IEnumerable<string> scopes = null, CancellationToken cancellationToken = default);
        Task<YHttpResponse<U>> ProcessRequestManagementAsync<U>(string pathUri, string query = null, object data = null, HttpMethod method = null, CancellationToken cancellationToken = default);
    }
}