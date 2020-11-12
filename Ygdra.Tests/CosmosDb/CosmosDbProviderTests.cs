using Microsoft.Azure.Cosmos;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Ygdra.Host.CosmosDb;
using Ygdra.Host.Services;
using Ygdra.Tests.Misc;
using Ygdra.Tests.Providers;

namespace Ygdra.Tests.CosmosDb
{
    public class CosmosDbProviderTests : YProviderTests
    {
        public override ProviderType ProviderType => ProviderType.CosmosDb;

        public override YCoreProvider CreateProvider(ProviderType providerType, string dbName)
        {
            var cs = HelperDatabase.GetConnectionString(providerType, dbName);

            return new YCosmosDbProvider(cs, dbName);
        }

        [Fact]
        public async Task Create_Database_Should_Work()
        {
            var dbName = HelperDatabase.GetRandomName("Y");
            var provider = this.CreateProvider(this.ProviderType, dbName);

            await provider.EnsureCreatedAsync();

            var cs = HelperDatabase.GetConnectionString(this.ProviderType, dbName);

            // fun new C#8 using notation
            using var client = new CosmosClient(cs);

            var database = client.GetDatabase(dbName);
            var response = await database.ReadAsync();

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            // Default container has the same name as database
            var container = database.GetContainer(dbName);
            var containerResponse = await container.ReadContainerAsync();

            Assert.Equal(HttpStatusCode.OK, containerResponse.StatusCode);

            var deleteDatabase = await database.DeleteAsync();
            Assert.Equal(HttpStatusCode.OK, deleteDatabase.StatusCode);
        }

    }
}
