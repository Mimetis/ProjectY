using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Ygdra.Core.Engine.Entities;

namespace Ygdra.Cli.NetCore
{
    public class ApiWrapper
    {
        /// <summary>
        /// Get engines from Ygdra.Host Web Api, using a Beader access token
        /// </summary>
        public static async Task<T> GetEnginesAsync<T>(string accessToken, string requestUri )
        {
            var httpClient = new HttpClient();

            using var requestMessage = new HttpRequestMessage(HttpMethod.Get, requestUri);
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            // Eventually, send the request
            var response = await httpClient.SendAsync(requestMessage);

            response.EnsureSuccessStatusCode();

            if (response.Content != null)
            {
                var content = await response.Content.ReadAsStringAsync();
                using var streamResponse = await response.Content.ReadAsStreamAsync();

                if (streamResponse.CanRead && streamResponse.Length > 0)
                    return Deserialize<T>(streamResponse);
            }

            return default;
        }

        public static async Task<T> SaveEngineAsync<T>(string accessToken, string requestUri, YEngine engine)
        {
            var httpClient = new HttpClient();

            using var requestMessage = new HttpRequestMessage(HttpMethod.Put, requestUri);
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            requestMessage.Content = new StringContent(JsonConvert.SerializeObject(engine), UnicodeEncoding.UTF8, "application/json");

            // Eventually, send the request
            var response = await httpClient.SendAsync(requestMessage);

            response.EnsureSuccessStatusCode();

            if (response.Content != null)
            {
                var content = await response.Content.ReadAsStringAsync();
                using var streamResponse = await response.Content.ReadAsStreamAsync();

                if (streamResponse.CanRead && streamResponse.Length > 0)
                    return Deserialize<T>(streamResponse);
            }

            return default;
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
    }
}
