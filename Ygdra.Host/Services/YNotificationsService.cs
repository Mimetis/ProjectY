using Microsoft.AspNetCore.SignalR;
using Microsoft.Azure.SignalR.Management;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ygdra.Core.Cloud.Entities;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Notifications;
using Ygdra.Core.Notifications.Entities;
using Ygdra.Core.Payloads;

namespace Ygdra.Host.Services
{
    public class YNotificationsService : IYNotificationsService
    {
        private readonly IServiceManager serviceManager;
        private readonly IYNotificationProvider notificationProvider;

        public YNotificationsService(IServiceManager serviceManager, IYNotificationProvider notificationProvider)
        {
            this.serviceManager = serviceManager;
            this.notificationProvider = notificationProvider;
        }

        private List<Guid> GetNotifiersGroup(YEngine engine, Guid? callerUserId = default, bool addMembers = false)
        {
            var allUsersToNotify = engine.Owners?.ToList();


            if (addMembers && allUsersToNotify != null && engine.Members != null && engine.Members.Count > 0)
                allUsersToNotify = allUsersToNotify.Union(engine.Members).Distinct().ToList();

            List<Guid> groupUsers = null;

            if (allUsersToNotify != null && allUsersToNotify.Count > 0)
                groupUsers = allUsersToNotify.Select(u => u.Id).ToList();

            if (callerUserId.HasValue)
            {
                if (groupUsers == null)
                    groupUsers = new List<Guid>();

                if (!groupUsers.Any(u => u == callerUserId.Value))
                    groupUsers.Add(callerUserId.Value);
            }

            return groupUsers;
        }

        public async Task CreateNotificationsDeploymentDoneAsync(string title, string message, YEngine engine, Guid? callerUserId = default, string url = default, bool addMembers = false)
        {
            var groupUsers = GetNotifiersGroup(engine, callerUserId, addMembers);

            if (groupUsers != null && groupUsers.Count > 0)
                await CreateNotificationsDeploymentDoneAsync(engine.Id, title, message, groupUsers, url).ConfigureAwait(false);
        }


        public async Task CreateNotificationsDeploymentDoneAsync(Guid linkId, string title, string message, IEnumerable<Guid> userIds, string url = default)
        {
            var existingNotifications = await notificationProvider.GetNotificationsFromLinkAsync(linkId).ConfigureAwait(false);

            // Save notif for all users
            foreach (var userId in userIds)
            {
                YNotification notification = null;

                notification = existingNotifications.FirstOrDefault(n => n.To == userId);

                if (notification == null)
                    notification = new YNotification { Id = Guid.NewGuid() };

                notification.LinkId = linkId;
                notification.To = userId;
                notification.IsRead = false;
                notification.Title = title;
                notification.Message = message;
                notification.SendDate = DateTime.Now;
                notification.Url = url;

                await notificationProvider.SaveNotificationAsync(notification);
            }

            // Broadcast to all user connected that are part of the deployment, to refresh notifications
            await SendRefreshNotificationsAsync(userIds);


        }

        public async Task SendRefreshNotificationsAsync(YEngine engine, Guid? callerUserId = default, bool addMembers = false)
        {
            var groupUsers = GetNotifiersGroup(engine, callerUserId, addMembers);

            if (groupUsers != null && groupUsers.Count > 0)
                await SendRefreshNotificationsAsync(groupUsers).ConfigureAwait(false);
        }

        /// <summary>
        /// Send an order to refresh notification to a users group
        /// </summary>
        public async Task SendRefreshNotificationsAsync(IEnumerable<Guid> userIds)
        {
            if (userIds == null)
                return;

            var group = userIds.Select(u => u.ToString()).ToList();

            if (group == null || group.Count <= 0)
                return;

            var hubContext = await serviceManager.CreateHubContextAsync("JobHub").ConfigureAwait(false);

            await hubContext.Clients.Groups(group).SendAsync("refresh_notifications", "refresh notifications", default).ConfigureAwait(false);
        }

        public async Task SendNotificationAsync(string method, YDeploymentStatePayloadState state, YEngine engine, string message, Guid? callerUserId = default, object resource = null, bool addMembers = false)
        {
            var groupUsers = GetNotifiersGroup(engine, callerUserId, addMembers);

            List<string> groups = null;

            if (groupUsers != null)
                groups = groupUsers.Select(guid => $"{engine.Id}-{guid}").ToList();

            if (groups == null || groups.Count <= 0)
                return;

            var hubContext = await serviceManager.CreateHubContextAsync("JobHub").ConfigureAwait(false);

            var deployState = new YDeploymentStatePayload(state)
            {
                Id = engine.Id,
                Message = message
            };

            if (resource != null)
                await hubContext.Clients.Groups(groups).SendAsync(method, deployState, resource, default).ConfigureAwait(false);
            else
                await hubContext.Clients.Groups(groups).SendAsync(method, deployState, default).ConfigureAwait(false);

        }

        public Task<bool> IsServiceHealthyAsync() => serviceManager.IsServiceHealthy(default);
    }
}
