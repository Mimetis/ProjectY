using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Azure;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Newtonsoft.Json.Linq;
using Ygdra.Core.Exceptions;

namespace Ygdra.Host.Controllers
{
    [ApiController]
    [ApiExplorerSettings(IgnoreApi = true)] // Ignore this API in Swagger otherwise Swagger will not work (for ... some reasons ??)
    public class ErrorController : ControllerBase
    {
        [Route("/yerror")]
        public IActionResult ErrorLocalDevelopment()
        {
            var context = HttpContext.Features.Get<IExceptionHandlerFeature>();
            var payload = new JObject();
            var statusCode = HttpStatusCode.BadRequest;

            if (context is IExceptionHandlerPathFeature pathContext)
                payload.Add("path", pathContext.Path);


            // {
            //  "errors": {
            //    "dataSourceView.Name": [
            //      "The Data source name field is required."
            //    ]
            //  },
            //  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
            //  "title": "One or more validation errors occurred.",
            //  "status": 400,
            //  "traceId": "|3ba62219-46056954fcce7fbc."
            //}

            //{
            //  "path": "/api/DataFactories/adc76cc7-cb63-4912-91fe-762f30600ea1/test",
            //  "error": {
            //    "message": "Login failed for user 'spertus'."
            //  }
            //}

            var errors = new JObject();
            payload.Add("errors", errors);

            switch (context.Error)
            {
                case CosmosException cosmosDbException:
                    errors.Add("cosmosDbException", new JArray { { cosmosDbException.ResponseBody } });
                    statusCode = cosmosDbException.StatusCode;
                    break;
                case YWebException yWebException:
                    errors.Add("webException", new JArray { { yWebException.Error } });
                    statusCode = yWebException.StatusCode;
                    break;
                case RequestFailedException requestFailedException:
                    errors.Add("requestFailedException", new JArray { { requestFailedException.Message } });
                    statusCode = (HttpStatusCode)requestFailedException.Status;
                    break;
                default:
                    errors.Add(context.Error.GetType().Name.ToLower(), new JArray { { context.Error.Message } });
                    break;

            }

            return new JsonResult(payload) { ContentType = "Application/json", StatusCode = (int)statusCode };
        }
    }
}
