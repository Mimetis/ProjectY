using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using Ygdra.Core.Exceptions;

namespace Ygdra.Core.Http
{
    public class YHttpResponse
    {
        public YHttpResponse()
        {

        }
        /// <summary>
        /// Gets the collection of HTTP response headers.
        /// </summary>
        [JsonIgnore]
        public Dictionary<string, string> Headers { get; set; }

        /// <summary>
        /// Gets or sets the status code of the HTTP response.
        /// </summary>
        [JsonIgnore]
        public HttpStatusCode StatusCode { get; set; }


        public static YHttpResponse NotFound => new YHttpResponse { StatusCode = HttpStatusCode.NotFound };

        /// <summary>
        /// Gets the update status Uri
        /// </summary>
        public string UpdateUri
        {
            get
            {
                this.Headers.TryGetValue("Location", out var location);
                this.Headers.TryGetValue("Operation-Location", out var operationLocation);
                this.Headers.TryGetValue("Azure-AsyncOperation", out var azureAsyncOperation);

                if (!string.IsNullOrEmpty(operationLocation))
                    return operationLocation;
                if (!string.IsNullOrEmpty(azureAsyncOperation))
                    return azureAsyncOperation;
                if (!string.IsNullOrEmpty(location))
                    return location;

                return null;
            }

        }
    }

    public class YHttpResponse<T> : YHttpResponse
    {

        /// <summary>
        /// Gets the value deserialized
        /// </summary>
        public T Value { get; set; }

        public YHttpResponse() { }

        public YHttpResponse(T val) => this.Value = val;

        public JsonResult ToJsonResult(HttpContext context)
        {
            if (this.Headers != null)
                foreach (var header in this.Headers.Where(h => h.Key.StartsWith("x-")))
                    context.Response.Headers.TryAdd(header.Key, header.Value);

            return new JsonResult(this.Value) { StatusCode = (int)this.StatusCode, ContentType = "application/json" };
        }
        public new static YHttpResponse<T> NotFound => new YHttpResponse<T> { StatusCode = HttpStatusCode.NotFound };


    }
}
