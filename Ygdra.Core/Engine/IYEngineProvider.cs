using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Ygdra.Core.Engine.Entities;

namespace Ygdra.Core.Engine
{
    public interface IYEngineProvider
    {
        Task<YEngine> GetEngineByNameAsync(string name, Guid userId);
        Task<YEngine> GetEngineByNameAsync(string name);
        Task<YEngine> GetEngineAsync(Guid engineRequestId, Guid userId);
        Task<YEngine> GetEngineAsync(Guid engineRequestId);
        Task<IEnumerable<YEngine>> GetEnginesAsync();
        Task<IEnumerable<YEngine>> GetEnginesAsync(Guid userId);

        Task<YEngine> SaveEngineAsync(YEngine engineRequest, Guid userId); 
        Task<YEngine> SaveEngineAsync(YEngine engineRequest);

        Task<bool> DeleteEngineAsync(Guid engineId, Guid userId);
        Task<bool> DeleteEngineAsync(Guid engineId);

    }
}
