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

        public static int url { get; set; }

        /// <summary>
        /// Get engines from Ygdra.Host Web Api, using a Beader access token
        /// </summary>
        public static async Task<T> GetEnginesAsync<T>(string accessToken)
        {
            var httpClient = new HttpClient();
            var ygdraApiUrl = Environment.GetEnvironmentVariable("Ygdra-ApiUrl", EnvironmentVariableTarget.User);

            using var requestMessage = new HttpRequestMessage(HttpMethod.Get, ygdraApiUrl + "/Engines");
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.SendAsync(requestMessage);

            response.EnsureSuccessStatusCode();

            if (response.Content != null)
            {
                using var streamResponse = await response.Content.ReadAsStreamAsync();

                if (streamResponse.CanRead && streamResponse.Length > 0)
                    return Deserialize<T>(streamResponse);
            }

            return default;
        }

        /// <summary>
        /// Get a sinlge engine fomr an engine id.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="accessToken">The token needed to reach out to the API.</param>
        /// <param name="enginedId">The engine id to retrieve.</param>
        /// <returns></returns>
        public static async Task<T> GetEngineAsync<T>(string accessToken, string enginedId)
        {
            var httpClient = new HttpClient();
            var ygdraApiUrl = Environment.GetEnvironmentVariable("Ygdra-ApiUrl", EnvironmentVariableTarget.User);

            using var requestMessage = new HttpRequestMessage(HttpMethod.Get, ygdraApiUrl + "/Engines/" + enginedId);
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            // Eventually, send the request
            var response = await httpClient.SendAsync(requestMessage);

            response.EnsureSuccessStatusCode();

            if (response.Content != null)
            {
                using var streamResponse = await response.Content.ReadAsStreamAsync();

                if (streamResponse.CanRead && streamResponse.Length > 0)
                    return Deserialize<T>(streamResponse);
            }

            return default;
        }

        /// <summary>
        /// Save the engine request.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="accessToken">The token needed to reach out to the API.</param>
        /// <param name="engineId">The id of the engine request (the engine Id itself).</param>
        /// <param name="engine">Engine object as configured in the Cli interaction.</param>
        /// <returns></returns>
        public static async Task<T> SaveEngineAsync<T>(string accessToken, string engineId, YEngine engine)
        {
            var httpClient = new HttpClient();
            var ygdraApiUrl = Environment.GetEnvironmentVariable("Ygdra-ApiUrl", EnvironmentVariableTarget.User);

            using var requestMessage = new HttpRequestMessage(HttpMethod.Put, ygdraApiUrl + "/Engines/" + engineId);
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            requestMessage.Content = new StringContent(JsonConvert.SerializeObject(engine), UnicodeEncoding.UTF8, "application/json");

            var response = await httpClient.SendAsync(requestMessage);

            response.EnsureSuccessStatusCode();

            if (response.Content != null)
            {
                using var streamResponse = await response.Content.ReadAsStreamAsync();

                if (streamResponse.CanRead && streamResponse.Length > 0)
                    return Deserialize<T>(streamResponse);
            }

            return default;
        }

        /// <summary>
        /// Initiates the deployment of the engines that was requested. The Admin has this privilege.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="accessToken">Token that needs to contain the claim this user is an Admin.</param>
        /// <param name="engineId">The engine id to be deployed.</param>
        /// <returns></returns>
        public static async Task<T> DeployEngineAsync<T>(string accessToken, string engineId, string location = null, string resourceGroupName =  null)
        {
            var httpClient = new HttpClient();
            var ygdraApiUrl = Environment.GetEnvironmentVariable("Ygdra-ApiUrl", EnvironmentVariableTarget.User);


            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            //Collect the engine object from the config db.
            var engine = await GetEngineAsync<YEngine>(accessToken, engineId);

            if(location != null)
            {
                engine.Location = location;
            }

            if(resourceGroupName !=null)
            {
                engine.ResourceGroupName = resourceGroupName;
            }

            using var saveRequestMessage = new HttpRequestMessage(HttpMethod.Put, ygdraApiUrl + "/Engines/" + engineId);
            saveRequestMessage.Content = new StringContent(JsonConvert.SerializeObject(engine), UnicodeEncoding.UTF8, "application/json");
            var saveRequestResponse = await httpClient.SendAsync(saveRequestMessage);

            saveRequestResponse.EnsureSuccessStatusCode();

            var requestMessage = new HttpRequestMessage(HttpMethod.Post, ygdraApiUrl + "/Engines/" + engine.Id + "/deploy");
            requestMessage.Content = new StringContent(JsonConvert.SerializeObject(engine), UnicodeEncoding.UTF8, "application/json");
            
            var response = await httpClient.SendAsync(requestMessage);

            response.EnsureSuccessStatusCode();

            if (response.Content != null)
            {
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
