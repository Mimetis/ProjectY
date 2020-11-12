using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using System.Threading.Tasks;
using Ygdra.Core;
using Ygdra.Core.Exceptions;
using Ygdra.Core.Settings.Entities;

namespace Ygdra.Host.CosmosDb
{
    public class YCosmosDbConfigurationProvider : ConfigurationProvider
    {
        private PartitionKey partitionKey = new PartitionKey(YType.Setting.ToString());
        private string partitionKeyName = "/Type";

        private readonly string accountEndpoint;
        private readonly string accountKey;
        private readonly string databaseName;
        private readonly string containerName;

        private CosmosClientOptions clientOptions = new CosmosClientOptions()
        {
            SerializerOptions = new CosmosSerializationOptions
            {
                IgnoreNullValues = true,
                Indented = true
            }
        };
        public YCosmosDbConfigurationProvider(string accountEndpoint, string accountKey, string databaseName, string containerName)
        {
            this.accountEndpoint = accountEndpoint;
            this.accountKey = accountKey;
            this.databaseName = databaseName;
            this.containerName = containerName;
        }

        public override void Load()
        {
            base.Load();
        }

        public async Task LoadAsync()
        {
            EnsureCreated();

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

            if (Data == null)
                Data = new Dictionary<string, string>();

            foreach (var s in results)
                Data.Add(s.Name, s.Value);

        }

        static YCosmosDbConfigurationProvider()
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
    }


    //public class YConfigurationSource : IConfigurationSource
    //{
    //    public YConfigurationSource()
    //    {
    //    }

    //    public IConfigurationProvider Build(IConfigurationBuilder builder)
    //    {
    //        return new YCosmosDbConfigurationProvider();

    //    }
    //}

    //public static class YConfigurationBuilderExtensionsSource
    //{
    //    public static IConfigurationBuilder AddYConfiguration(
    //        this IConfigurationBuilder builder)
    //    {
    //        var config = builder.Build();

    //        var cosmos = config.Bind()

    //        builder.Add(new EntityConfigurationSource(optionsAction));

    //    }
    //}
}
