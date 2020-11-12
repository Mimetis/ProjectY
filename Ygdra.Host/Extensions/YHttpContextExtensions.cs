using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Ygdra.Core.Exceptions;

namespace Ygdra.Host.Extensions
{
    public static class YHttpContextExtensions
    {

        //public static JsonResult CreateJsonErrorResult(this Exception ex, string message = null, HttpStatusCode statusCode = HttpStatusCode.BadRequest)
        //{

        //    if (message != null)
        //        return new JsonResult(message, statusCode);

        //    if (ex is YWebException yWebException && yWebException.Error != null)
        //        return new JsonResult(yWebException.Error) { StatusCode = (int)yWebException.StatusCode, ContentType = "application/json" };

        //    if (ex.Message != null)
        //        return CreateJsonErrorResult(ex, ex.Message, HttpStatusCode.BadRequest);

        //    if (!string.IsNullOrEmpty(ex.InnerException?.Message))
        //        return new JsonResult(ex.InnerException.Message, HttpStatusCode.BadRequest);

        //    return new JsonResult("Bad Request", HttpStatusCode.BadRequest);

        //}

    }
}
