using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Exceptions;
using Ygdra.Core.Http;

namespace Ygdra.Web.UI.Controllers
{
    public class YControllerBase : ControllerBase
    {


        public IActionResult Execute(Func<JsonResult> action)
        {
            try
            {

                return action();
            }
            catch (YWebException ex)
            {
                return new YJsonResult<object>(ex.Error) { StatusCode = ex.StatusCode };
            }
            catch (Exception ex)
            {
                return new YJsonResult<object>(ex.Message);
            }
        }
        public async Task<IActionResult> ExecuteAsync(Func<Task<JsonResult>> actionTask)
        {
            try
            {
                return await actionTask().ConfigureAwait(false);
            }
            catch (YWebException ex)
            {
                return new YJsonResult<object>(ex.Error) { StatusCode = ex.StatusCode };
            }
            catch (Exception ex)
            {
                return new YJsonResult<object>(ex.Message);
            }
        }
        public async Task<ActionResult<T>> ExecuteAsync<T>(Func<Task<T>> actionTask)
        {
            try
            {
                return await actionTask().ConfigureAwait(false);
            }
            catch (YWebException ex)
            {
                return new YJsonResult<T>(ex.Error) { StatusCode = ex.StatusCode };
            }
            catch (Exception ex)
            {
                return new YJsonResult<T>(ex.Message);
            }
        }
        public async Task<YJsonResult<T>> YExecuteAsync<T>(Func<Task<T>> actionTask)
        {
            try
            {
                return await actionTask().ConfigureAwait(false);
            }
            catch (YWebException ex)
            {
                return new YJsonResult<T>(ex.Error) { StatusCode = ex.StatusCode };
            }
            catch (Exception ex)
            {
                return new YJsonResult<T>(ex.Message);
            }
        }



    }
}
