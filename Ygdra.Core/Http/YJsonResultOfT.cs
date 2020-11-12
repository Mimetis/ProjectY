using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Ygdra.Core.Http
{
    public class YJsonResult<T> : ActionResult
    {
        private T value;
        private JObject error;

        public YJsonResult(T value)
        {
            Value = value;
        }
        public YJsonResult(JObject error, HttpStatusCode httpStatusCode = HttpStatusCode.BadRequest)
        {
            this.Error = error;
            this.StatusCode = httpStatusCode;
        }

        public YJsonResult(string errorMessage, HttpStatusCode httpStatusCode = HttpStatusCode.BadRequest)
        {
            this.Error = new JObject { { "message", errorMessage } };
            this.StatusCode = httpStatusCode;
        }

        /// <summary>
        /// Gets or sets the HTTP status code.
        /// </summary>
        public HttpStatusCode StatusCode { get; set; }

        /// <summary>
        /// Gets or sets the value to be formatted.
        /// </summary>
        public T Value
        {
            get => value;

            set
            {
                this.value = value;
                this.StatusCode = HttpStatusCode.OK;
            }
        }
        /// <summary>
        /// Gets or sets the error to be formatted, if we can't get the T Value for some reasons.
        /// </summary>
        public JObject Error
        {
            get => error;

            set
            {
                this.error = value;
                this.StatusCode = HttpStatusCode.BadRequest;
            }
        }

        /// <summary>
        /// Gets if the JsonResult has an error. StatusCode >= 400 && Error not Null
        /// </summary>
        public bool HasError => (int)this.StatusCode >= 400 && this.Error != null;

        /// <inheritdoc />
        public override Task ExecuteResultAsync(ActionContext context)
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));
            
            JsonResult jr;

            if (this.Error != null)
                jr = new JsonResult(this.Error) { StatusCode = (int)this.StatusCode };
            else
                jr = new JsonResult(this.Value) { StatusCode = (int)this.StatusCode };

            var services = context.HttpContext.RequestServices;
            var executor = services.GetRequiredService<IActionResultExecutor<JsonResult>>();

            return executor.ExecuteAsync(context, jr);
        }

        /// <summary>
        /// implicitly transform a T value in YJsonResult<T>
        /// </summary>
        public static implicit operator YJsonResult<T>(T value)
        {
            return new YJsonResult<T>(value);
        }

    }
}
