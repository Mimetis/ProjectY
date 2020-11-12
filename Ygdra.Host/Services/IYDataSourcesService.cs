using System;
using System.Threading.Tasks;
using Ygdra.Core.DataSources.Entities;

namespace Ygdra.Host.Services
{
    public interface IYDataSourcesService
    {
        Task<bool> TestAsync(YDataSource dataSource);
    }
}