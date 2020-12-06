using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Ygdra.Core;
using Ygdra.Core.Engine;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Exceptions;
using Ygdra.Core.Options;

namespace Ygdra.Host.CosmosDb
{
    public class YCosmosDbEngineProvider : IYEngineProvider
    {
        private string accountEndpoint;
        private string accountKey;
        private PartitionKey enginePartitionKey = new PartitionKey(YType.Engine.ToString());

        private string databaseName;
        private string containerName;

        private string partitionKeyName = "/Type";

        private CosmosClientOptions clientOptions = new CosmosClientOptions()
        {
            SerializerOptions = new CosmosSerializationOptions
            {
                IgnoreNullValues = true,
                Indented = true
            }
        };


        public YCosmosDbEngineProvider(IOptions<YProviderOptions> options)
        {
            this.accountEndpoint = options.Value.Endpoint;
            this.accountKey = options.Value.AccountKey;
            this.databaseName = options.Value.Database;
            this.containerName = options.Value.Container;
            EnsureCreated();
        }

        static YCosmosDbEngineProvider()
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

        public Task EnsureDeletedAsync()
        {
            try
            {
                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                throw new DataSourceCreationFailedException(databaseName, ex);
            }
        }

        /// <summary>
        /// Gets an engine without checking user as Owner or Member
        /// </summary>
        public async Task<YEngine> GetEngineAsync(Guid id)
        {
            using CosmosClient client = new CosmosClient(accountEndpoint, accountKey, clientOptions);
            var container = client.GetContainer(databaseName, containerName);

            var engine = await container.ReadItemAsync<YEngine>(id.ToString(), enginePartitionKey);

            return engine;


        }

        /// <summary>
        /// Gets an engine with checking of the user as Owner or Member
        /// </summary>
        public async Task<YEngine> GetEngineAsync(Guid id, Guid userId)
        {
            try
            {

                using CosmosClient client = new CosmosClient(accountEndpoint, accountKey, clientOptions);
                var container = client.GetContainer(databaseName, containerName);

                var results = new List<YEngine>();

                var commandText = @"SELECT VALUE c
                        FROM c
                        WHERE (EXISTS(SELECT VALUE o FROM o IN c.Owners WHERE o.Id = @userId)
                               OR EXISTS(SELECT VALUE o FROM o IN c.Members WHERE o.Id = @userId))
                        AND c.id = @id";

                QueryDefinition query = new QueryDefinition(commandText)
                        .WithParameter("@userId", userId)
                        .WithParameter("@id", id);

                var resultSetIterator = container.GetItemQueryIterator<YEngine>(
                    query, null,
                    new QueryRequestOptions()
                    {
                        PartitionKey = enginePartitionKey,
                        MaxItemCount = 1
                    });

                var feedResponse = await resultSetIterator.ReadNextAsync().ConfigureAwait(false);

                var engine = feedResponse.FirstOrDefault();

                return engine;
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                return null;
            }

        }

        /// <summary>
        /// Gets all engines without checking user as owner or member
        /// </summary>
        public async Task<IEnumerable<YEngine>> GetEnginesAsync()
        {
            try
            {
                using CosmosClient client = new CosmosClient(accountEndpoint, accountKey, clientOptions);
                var container = client.GetContainer(databaseName, containerName);

                var results = new List<YEngine>();

                var query = new QueryDefinition("SELECT VALUE c FROM c");

                var resultSetIterator = container.GetItemQueryIterator<YEngine>(
                query, null, new QueryRequestOptions { PartitionKey = enginePartitionKey });

                while (resultSetIterator.HasMoreResults)
                {
                    FeedResponse<YEngine> response = await resultSetIterator.ReadNextAsync().ConfigureAwait(false);
                    results.AddRange(response);
                }

                return results;
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                return null;
            }
        }
        public async Task<IEnumerable<YEngine>> GetEnginesAsync(Guid userId)
        {
            try
            {
                using CosmosClient client = new CosmosClient(accountEndpoint, accountKey, clientOptions);
                var container = client.GetContainer(databaseName, containerName);

                var results = new List<YEngine>();

                QueryDefinition query = new QueryDefinition(
                        "SELECT VALUE c FROM c JOIN o in c.Owners WHERE o.Id = @userId")
                        .WithParameter("@userId", userId);

                var resultSetIterator = container.GetItemQueryIterator<YEngine>(
                query, null, new QueryRequestOptions { PartitionKey = enginePartitionKey });

                while (resultSetIterator.HasMoreResults)
                {
                    FeedResponse<YEngine> response = await resultSetIterator.ReadNextAsync();
                    results.AddRange(response);
                }

                return results;
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                return null;
            }
        }

        public async Task<YEngine> SaveEngineAsync(YEngine engine, Guid userId)
        {
            try
            {
                using CosmosClient client = new CosmosClient(accountEndpoint, accountKey, clientOptions);
                var container = client.GetContainer(databaseName, containerName);

                engine.UpdateDate = DateTime.Now;

                if (!engine.RequestDate.HasValue || engine.RequestDate == DateTime.MinValue)
                    engine.RequestDate = DateTime.Now;

                ItemResponse<YEngine> response = await container.UpsertItemAsync(
                    engine, enginePartitionKey).ConfigureAwait(false);

                return engine;
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                return null;
            }

        }

        public async Task<YEngine> SaveEngineAsync(YEngine engine)
        {
            try
            {
                using CosmosClient client = new CosmosClient(accountEndpoint, accountKey, clientOptions);
                var container = client.GetContainer(databaseName, containerName);

                engine.UpdateDate = DateTime.Now;

                if (!engine.RequestDate.HasValue || engine.RequestDate == DateTime.MinValue)
                    engine.RequestDate = DateTime.Now;

                ItemResponse<YEngine> response = await container.UpsertItemAsync(
                    engine, enginePartitionKey).ConfigureAwait(false);

                return engine;
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                return null;
            }
        }

        public async Task<YEngine> GetEngineByNameAsync(string name)
        {
            try
            {

                using CosmosClient client = new CosmosClient(accountEndpoint, accountKey, clientOptions);
                var container = client.GetContainer(databaseName, containerName);

                var results = new List<YEngine>();

                QueryDefinition query = new QueryDefinition(
                        @"SELECT VALUE c
                        FROM c
                        WHERE c.EngineName = @name")
                        .WithParameter("@name", name);

                var resultSetIterator = container.GetItemQueryIterator<YEngine>(
                    query, null, new QueryRequestOptions { PartitionKey = enginePartitionKey, MaxItemCount = 1 });

                FeedResponse<YEngine> response = await resultSetIterator.ReadNextAsync().ConfigureAwait(false);

                return response.FirstOrDefault();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                return null;
            }

        }

        public async Task<YEngine> GetEngineByNameAsync(string name, Guid userId)
        {
            try
            {

                using CosmosClient client = new CosmosClient(accountEndpoint, accountKey, clientOptions);
                var container = client.GetContainer(databaseName, containerName);

                var results = new List<YEngine>();

                QueryDefinition query = new QueryDefinition(
                        @"SELECT VALUE c
                        FROM c
                        WHERE (EXISTS(SELECT VALUE o FROM o IN c.Owners WHERE o.Id = @userId)
                               OR EXISTS(SELECT VALUE o FROM o IN c.Members WHERE o.Id = @userId))
                        AND c.EngineName = @name")
                        .WithParameter("@userId", userId)
                        .WithParameter("@name", name);

                var resultSetIterator = container.GetItemQueryIterator<YEngine>(
                    query, null, new QueryRequestOptions { PartitionKey = enginePartitionKey, MaxItemCount = 1 });

                FeedResponse<YEngine> response = await resultSetIterator.ReadNextAsync().ConfigureAwait(false);

                return response.FirstOrDefault();
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                return null;
            }

        }

        public async Task<bool> DeleteEngineAsync(Guid id, Guid userId)
        {
            try
            {
                using CosmosClient client = new CosmosClient(accountEndpoint, accountKey, clientOptions);
                var container = client.GetContainer(databaseName, containerName);

                QueryDefinition query = new QueryDefinition(
                        @"SELECT VALUE c
                        FROM c
                        WHERE EXISTS(SELECT VALUE o FROM o IN c.Owners WHERE o.Id = @userId)
                        AND c.id = @id")
                        .WithParameter("@userId", userId)
                        .WithParameter("@id", id);

                var resultSetIterator = container.GetItemQueryIterator<YEngine>(
                query, null, new QueryRequestOptions { PartitionKey = enginePartitionKey, MaxItemCount = 1 });

                var feedResponse = await resultSetIterator.ReadNextAsync().ConfigureAwait(false);

                var engine = feedResponse.FirstOrDefault();

                if (engine != null)
                {
                    var response = await container.DeleteItemAsync<YEngine>(
                        id.ToString(), enginePartitionKey).ConfigureAwait(false);
                }
                else
                {
                    throw new UnauthorizedAccessException("Unauthorized to delete this engine.");
                }

                return true;
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                return false;
            }
        }
        public async Task<bool> DeleteEngineAsync(Guid id)
        {
            try
            {
                using CosmosClient client = new CosmosClient(accountEndpoint, accountKey, clientOptions);
                var container = client.GetContainer(databaseName, containerName);

                var response = await container.DeleteItemAsync<YEngine>(
                    id.ToString(), enginePartitionKey).ConfigureAwait(false);

                return true;
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                return false;
            }
        }

    }
}
