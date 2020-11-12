using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Ygdra.Core.Auth;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Http;

namespace Ygdra.Web.UI.SignalR
{
    public class JobHub : Hub
    {
        public JobHub()
        {
            
        }

        public async Task SubscribeDeploymentAsync(Guid deploymentId)
        {
            var userId = Context.GetHttpContext()?.User?.GetObjectId();

            if (!string.IsNullOrEmpty(userId))
            {
                var id = $"{deploymentId}-{userId}";
                await Groups.AddToGroupAsync(Context.ConnectionId, id);
            }


        }

        public override async Task OnConnectedAsync()
        {
            var user = Context.GetHttpContext()?.User?.GetObjectId();

            if (!string.IsNullOrEmpty(user))
                await Groups.AddToGroupAsync(Context.ConnectionId, user);

            Debug.WriteLine($"[{DateTime.Now}] Called OnConnected");
            await base.OnConnectedAsync();
            await this.Clients.Caller.SendAsync("connected", "[SERVER] : OnConnectedAsync called");
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var user = Context.GetHttpContext()?.User?.GetObjectId();

            if (!string.IsNullOrEmpty(user))
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, user);

            Debug.WriteLine($"[{DateTime.Now}] Called OnDisconnected");
            await base.OnDisconnectedAsync(exception);
        }

    }
}
