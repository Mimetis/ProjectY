using System;
using System.Threading;
using System.Threading.Tasks;
using Ygdra.Core.Engine.Entities;

namespace Ygdra.Host.BackgroundServices
{
    public interface IYEnginesService
    {
        Task CreateEngineDeploymentAsync(YEngine deployment, Guid? callerUserId = default, CancellationToken token = default);
        Task DeleteEngineDeploymentAsync(YEngine deployment, Guid? callerUserId = default, CancellationToken token = default);
    }
}