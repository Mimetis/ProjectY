using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Ygdra.Core.Cloud.Entities;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Payloads;

namespace Ygdra.Host.Services
{
    public interface IYNotificationsService
    {
        Task CreateNotificationsDeploymentDoneAsync(Guid linkId, string title, string message, IEnumerable<Guid> userIds, string url = default);
        Task CreateNotificationsDeploymentDoneAsync(string title, string message, YEngine engine, Guid? callerUserId = default, string url = default, bool addMembers = false);
        Task SendNotificationAsync(string method, YDeploymentStatePayloadState state, YEngine engine, string message, Guid? callerUserId = default, object resource = null, bool addMembers = false);
        Task SendRefreshNotificationsAsync(IEnumerable<Guid> userIds);
        Task SendRefreshNotificationsAsync(YEngine engine, Guid? callerUserId = default, bool addMembers = false);

        Task<bool> IsServiceHealthyAsync();
    }
}