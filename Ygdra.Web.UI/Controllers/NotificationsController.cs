using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ygdra.Core.Http;
using Ygdra.Core.Notifications.Entities;

namespace Ygdra.Web.UI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : YControllerBase
    {
        private IYHttpRequestHandler client;

        public NotificationsController(IYHttpRequestHandler client)
        {
            this.client = client;
        }


        [HttpGet()]
        [Authorize]
        public Task<YJsonResult<IList<YNotification>>> GetNotificationsAsync()
        {
            return YExecuteAsync(async () =>
            {
                var response = await this.client.ProcessRequestApiAsync<IList<YNotification>>($"api/Notifications", null).ConfigureAwait(false);
                return response.Value;
            });
        }

        [HttpDelete]
        [Authorize]
        public Task<YJsonResult<bool>> DeleteNotificationsAsync()
        {
            return YExecuteAsync(async () =>
            {
                var response = await this.client.ProcessRequestApiAsync<bool>(
                $"api/Notifications", null, null, HttpMethod.Delete).ConfigureAwait(false);

                return response.Value;
            });
        }
    }
}
