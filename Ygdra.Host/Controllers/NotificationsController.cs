using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Hangfire;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.SignalR.Management;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Client;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.Resource;
using Newtonsoft.Json.Linq;
using Ygdra.Core.Cloud;
using Ygdra.Core.Engine;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Notifications;
using Ygdra.Core.Notifications.Entities;
using Ygdra.Core.Payloads;
using Ygdra.Core.Services;
using Ygdra.Host.BackgroundServices;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Ygdra.Host.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [Produces("application/json")]
    public class NotificationsController : ControllerBase
    {
        private readonly IYNotificationProvider notificationProvider;
        static readonly string[] scopeRequiredByApi = new string[] { "user_impersonation" };

        public NotificationsController(IYNotificationProvider notificationProvider)
        {
            this.notificationProvider = notificationProvider;
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<YNotification>> GetNotificationAsync(Guid id)
        {
            HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);

            var userObjectId = this.User.GetObjectId();

            if (string.IsNullOrEmpty(userObjectId))
                return new UnauthorizedObjectResult("User unknown");

            var notification= await this.notificationProvider.GetNotificationAsync(id).ConfigureAwait(false);

            if (notification == null)
                return NotFound($"Notification {id} does not exists");

            return notification;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<YNotification>> SaveNotificationAsync(Guid id, [FromBody] YNotification notification)
        {
            HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);

            var userObjectId = this.User.GetObjectId();

            if (id != notification.Id)
                return new UnprocessableEntityObjectResult("id and entity differs");

            if (string.IsNullOrEmpty(userObjectId))
                return new UnauthorizedObjectResult("User unknown");

            var savedNotif = await this.notificationProvider.SaveNotificationAsync(notification).ConfigureAwait(false);

            return savedNotif;

        }


        /// <summary>
        /// Gets all engine requests for the current authenticated user
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<YNotification>>> GetNotificationsAsync()
        {
            
                HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);

                var userClaims = this.HttpContext.User;

                var userId = this.User.GetObjectId();

                var notifications = await this.notificationProvider.GetNotificationsAsync(new Guid(userId)).ConfigureAwait(false);

                if (notifications == null || !notifications.Any())
                    return new OkResult();

                return notifications.ToList();

           
        }

      
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteNotificationAsync(Guid id)
        {
            HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);

            var userObjectId = this.User.GetObjectId();

            if (string.IsNullOrEmpty(userObjectId))
                return new UnauthorizedObjectResult("User unknown");

            var userId = new Guid(userObjectId);

            bool isDeleted;

            isDeleted = await this.notificationProvider.DeleteNotificationAsync(id).ConfigureAwait(false);


            return isDeleted;

        }

        [HttpDelete()]
        public async Task<ActionResult<bool>> DeleteNotificationsAsync()
        {
            HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);

            var userObjectId = this.User.GetObjectId();

            if (string.IsNullOrEmpty(userObjectId))
                return new UnauthorizedObjectResult("User unknown");

            var userId = new Guid(userObjectId);

            bool isDeleted;

            isDeleted = await this.notificationProvider.DeleteAllNotificationsAsync(userId).ConfigureAwait(false);

            return isDeleted;

        }


    }
}
