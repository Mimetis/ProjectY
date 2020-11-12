using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Ygdra.Core.Notifications.Entities;

namespace Ygdra.Core.Notifications
{
    public interface IYNotificationProvider
    {
        Task<bool> DeleteNotificationAsync(Guid id);
        void EnsureCreated();
        Task<YNotification> GetNotificationAsync(Guid id);
        Task<IEnumerable<YNotification>> GetNotificationsAsync(Guid userId);
        Task<IEnumerable<YNotification>> GetNotificationsFromLinkAsync(Guid linkId);
        Task<YNotification> SaveNotificationAsync(YNotification notification);
        Task<bool> DeleteAllNotificationsAsync(Guid userId);
    }
}