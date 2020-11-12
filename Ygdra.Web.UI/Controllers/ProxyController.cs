using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.Graph;
using Microsoft.Identity.Client;
using Microsoft.Identity.Web;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Ygdra.Core.Graph;
using Ygdra.Core.Options;

namespace Ygdra.Web.UI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProxyController : ControllerBase
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IYGraphProvider graphSdkHelper;
        private readonly ITokenAcquisition tokenAcquisition;
        private readonly IOptions<YGraphOptions> graphOptions;

        public ProxyController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor,
            IYGraphProvider graphSdkHelper, ITokenAcquisition tokenAcquisition, IOptions<YGraphOptions> graphOptions)
        {
            this.httpContextAccessor = httpContextAccessor;
            this.graphSdkHelper = graphSdkHelper;
            this.tokenAcquisition = tokenAcquisition;
            this.graphOptions = graphOptions;
        }


        [HttpGet]
        public IActionResult SignIn()
        {
            var redirectUrl = Url.Page("/Index");
            return RedirectToPage(redirectUrl);

        }


        [HttpGet]
        [Route("{*all}")]
        public async Task<IActionResult> GetAsync(string all)
        {
            return await ProcessRequestAsync("GET", all, null).ConfigureAwait(false);
        }

        [HttpPost]
        [Route("{*all}")]
        public async Task<IActionResult> PostAsync(string all, [FromBody] object body)
        {
            return await ProcessRequestAsync("POST", all, body).ConfigureAwait(false);
        }

        [HttpDelete]
        [Route("{*all}")]
        public async Task<IActionResult> DeleteAsync(string all)
        {
            return await ProcessRequestAsync("DELETE", all, null).ConfigureAwait(false);
        }

        [HttpPut]
        [Route("{*all}")]
        public async Task<IActionResult> PutAsync(string all, [FromBody] object body)
        {
            return await ProcessRequestAsync("PUT", all, body).ConfigureAwait(false);
        }

        [HttpPatch]
        [Route("{*all}")]
        public async Task<IActionResult> PatchAsync(string all, [FromBody] object body)
        {
            return await ProcessRequestAsync("PATCH", all, body).ConfigureAwait(false);
        }

        private async Task<IActionResult> ProcessRequestAsync(string method, string all, object content)
        {
            var graphClient = graphSdkHelper.GraphClient;

            var qs = HttpContext.Request.QueryString;
            var url = $"{GetBaseUrlWithoutVersion(graphClient)}/{all}{qs.ToUriComponent()}";


            //var session = this.httpContextAccessor.HttpContext.Session;
            //await session.LoadAsync().ConfigureAwait(false);
            //var jsonString = session.GetString($"graph-{url}");

            //if (!string.IsNullOrEmpty(jsonString))
            //{
            //    return new ContentResult()
            //    {
            //        Content = jsonString,
            //        ContentType = "application/json"
            //    };
            //}

            var request = new BaseRequest(url, graphClient, null)
            {
                Method = method,
                ContentType = HttpContext.Request.ContentType,
            };

            var neededHeaders = Request.Headers.Where(h => h.Key.ToLower() == "if-match").ToList();
            if (neededHeaders.Count() > 0)
            {
                foreach (var header in neededHeaders)
                {
                    request.Headers.Add(new HeaderOption(header.Key, string.Join(",", header.Value)));
                }
            }

            var contentType = "application/json";

            try
            {
                using (var response = await request.SendRequestAsync(content?.ToString(), CancellationToken.None, HttpCompletionOption.ResponseContentRead).ConfigureAwait(false))
                {
                    response.Content.Headers.TryGetValues("content-type", out var contentTypes);

                    contentType = contentTypes?.FirstOrDefault() ?? contentType;


                    if (contentType.ToLowerInvariant().Contains("application/json"))
                    {
                        var stringContent = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                        return new ContentResult {  Content = stringContent, ContentType=contentType };
                    }
                    else
                    {
                        var byteArrayContent = await response.Content.ReadAsByteArrayAsync().ConfigureAwait(false);
                        return new FileContentResult(byteArrayContent, new MediaTypeHeaderValue(contentType));

                    }

                }
            }
            catch (ServiceException ex)
            {
                return new JsonResult(new { Error = ex.Error.ToString() });
            }

        }

        private string GetBaseUrlWithoutVersion(GraphServiceClient graphClient)
        {
            var baseUrl = graphClient.BaseUrl;
            var index = baseUrl.LastIndexOf('/');
            return baseUrl.Substring(0, index);
        }
    }
}
