using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Ygdra.Core.Entities;
using Ygdra.Host.Services;
using Ygdra.Tests.Misc;

namespace Ygdra.Tests.Providers
{
    public abstract class YProviderTests : IClassFixture<HelperProvider>, IDisposable
    {

        private YCoreProvider provider;
        private string dbName;
        private string engineName;

        /// <summary>
        /// Get the provider used for this tests round trip
        /// </summary>
        public abstract ProviderType ProviderType { get; }

        /// <summary>
        /// Create a provider
        /// </summary>
        public abstract YCoreProvider CreateProvider(ProviderType providerType, string dbName);

        public YProviderTests()
        {
            this.dbName = HelperDatabase.GetRandomName("Y");
            this.engineName = HelperDatabase.GetRandomName("eng");
            this.provider = this.CreateProvider(this.ProviderType, dbName);
        }


        public void Dispose()
        {
            provider.EnsureDeletedAsync().GetAwaiter().GetResult();
        }


        [Fact]
        public async Task Insert_EngineRequest_ShouldWork()
        {
            await provider.EnsureCreatedAsync();

            var owners = new List<Guid>
            {
                new Guid("06c381ef-7b3d-42f2-b79d-89901be26569"),
                new Guid("16c381ef-7b3d-42f2-b79d-89901be26569"),
                new Guid("26c381ef-7b3d-42f2-b79d-89901be26569")
            };

            var request = new EngineRequest
            {
                EngineType = YEngineType.Synapse,
                Name = engineName,
                Owners = owners.Select(o => new Person { Id = o }).ToList()
            };

            var insertedRequest = await provider.SaveEngineRequestAsync(request);

            Assert.NotEqual(Guid.Empty, insertedRequest.EngineRequestId);

        }
        [Fact]
        public async Task Read_EngineRequest_ByName_ShouldWork()
        {
            await Insert_EngineRequest_ShouldWork();

            var er = await provider.GetEngineRequestByNameAsync(this.engineName, new Guid("06c381ef-7b3d-42f2-b79d-89901be26569"));

            Assert.Equal(this.engineName, er.Name);
            Assert.Equal(3, er.Owners.Count());

        }


    }
}
