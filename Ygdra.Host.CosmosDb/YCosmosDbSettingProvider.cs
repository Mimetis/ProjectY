using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using System.Threading.Tasks;
using Ygdra.Core;
using Ygdra.Core.Exceptions;
using Ygdra.Core.Options;
using Ygdra.Core.Settings;
using Ygdra.Core.Settings.Entities;

namespace Ygdra.Host.CosmosDb
{
    public class YCosmosDbSettingProvider : IYSettingProvider
    {
        private PartitionKey partitionKey = new PartitionKey(YType.Setting.ToString());
        private string partitionKeyName = "/Type";

        private string accountEndpoint;
        private string accountKey;
        private string databaseName;
        private string containerName;

        private CosmosClientOptions clientOptions = new CosmosClientOptions()
        {
            SerializerOptions = new CosmosSerializationOptions
            {
                IgnoreNullValues = true,
                Indented = true
            }
        };

        public YCosmosDbSettingProvider(IOptions<YProviderOptions> options)
        {
            this.accountEndpoint = options.Value.Endpoint;
            this.accountKey = options.Value.AccountKey;
            this.databaseName = options.Value.Database;
            this.containerName = options.Value.Container;
            EnsureCreated();
        }

        static YCosmosDbSettingProvider()
        {
            Type defaultTrace = Type.GetType("Microsoft.Azure.Cosmos.Core.Trace.DefaultTrace,Microsoft.Azure.Cosmos.Direct");
            TraceSource traceSource = (TraceSource)defaultTrace.GetProperty("TraceSource").GetValue(null);
            traceSource.Switch.Level = SourceLevels.All;
            traceSource.Listeners.Clear();
        }
        public void EnsureCreated()
        {
            try
            {
                using CosmosClient client = new CosmosClient(accountEndpoint, accountKey, clientOptions);
                var taskCreate = client.CreateDatabaseIfNotExistsAsync(databaseName);
                Database database = taskCreate.GetAwaiter().GetResult();

                var containerProperties = new ContainerProperties(containerName, partitionKeyName);

                var containerCreateTask = database.CreateContainerIfNotExistsAsync(containerProperties);
                containerCreateTask.GetAwaiter().GetResult();
            }
            catch (Exception ex)
            {
                throw new DataSourceCreationFailedException(databaseName, ex);
            }
        }

        public async Task<YSetting> GetSettingAsync(Guid id)
        {
            using CosmosClient client = new CosmosClient(accountEndpoint, accountKey, clientOptions);
            var container = client.GetContainer(databaseName, containerName);

            var item = await container.ReadItemAsync<YSetting>(id.ToString(), partitionKey);

            return item;
        }

        public async Task<YSetting> SaveSettingAsync(YSetting setting)
        {
            using CosmosClient client = new CosmosClient(accountEndpoint, accountKey, clientOptions);
            var container = client.GetContainer(databaseName, containerName);

            setting.UpdateDate = DateTime.Now;

            ItemResponse<YSetting> response = await container.UpsertItemAsync(setting, partitionKey).ConfigureAwait(false);

            return setting;
        }

        public async Task<bool> DeleteSettingAsync(Guid id)
        {
            using CosmosClient client = new CosmosClient(accountEndpoint, accountKey, clientOptions);
            var container = client.GetContainer(databaseName, containerName);

            var response = await container.DeleteItemAsync<YSetting>(id.ToString(), partitionKey).ConfigureAwait(false);

            return true;
        }

        public async Task<IEnumerable<YSetting>> GetSettingsAsync()
        {
            using CosmosClient client = new CosmosClient(accountEndpoint, accountKey, clientOptions);
            var container = client.GetContainer(databaseName, containerName);

            var results = new List<YSetting>();

            var query = new QueryDefinition("SELECT VALUE c FROM c ORDER BY c.Name");

            var resultSetIterator = container.GetItemQueryIterator<YSetting>(
            query, null, new QueryRequestOptions { PartitionKey = partitionKey });

            while (resultSetIterator.HasMoreResults)
            {
                FeedResponse<YSetting> response = await resultSetIterator.ReadNextAsync().ConfigureAwait(false);
                results.AddRange(response);
            }

            return results;
        }
    }
}
