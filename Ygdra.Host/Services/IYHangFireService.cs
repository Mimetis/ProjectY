using Hangfire.Common;
using Ygdra.Core.Engine.Entities;

namespace Ygdra.Host.Services
{
    public interface IYHangFireService
    {
        Job GetProcessingJob(YEngine engine);
    }
}