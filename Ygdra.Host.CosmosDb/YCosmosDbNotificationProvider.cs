using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using System.Threading.Tasks;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Exceptions;
using Ygdra.Core.Notifications;
using Ygdra.Core.Notifications.Entities;
using Ygdra.Core.Options;

namespace Ygdra.Host.CosmosDb
{
    public class YCosmosDbNotificationProvider : IYNotificationProvider
    {
        private string accountEndpoint;
        private string accountKey;
        private PartitionKey engineRequestPartitionKey = new PartitionKey("Notification");
        private string partitionKeyName = "/Type";

        private string databaseName;
        private string containerName;


        static YCosmosDbNotificationProvider()
        {
            Type defaultTrace = Type.GetType("Microsoft.Azure.Cosmos.Core.Trace.DefaultTrace,Microsoft.Azure.Cosmos.Direct");
            TraceSource traceSource = (TraceSource)defaultTrace.GetProperty("TraceSource").GetValue(null);
            traceSource.Switch.Level = SourceLevels.All;
            traceSource.Listeners.Clear();
        }

        private CosmosClientOptions clientOptions = new CosmosClientOptions()
        {
            SerializerOptions = new CosmosSerializationOptions
            {
                IgnoreNullValues = true,
                Indented = true
            }
        };


        public YCosmosDbNotificationProvider(IOptions<YProviderOptions> options)
        {
            this.accountEndpoint = options.Value.Endpoint;
            this.accountKey = options.Value.AccountKey;
            this.databaseName = options.Value.Database;
            this.containerName = options.Value.Container;
            EnsureCreated();
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


        /// <summary>
        /// Gets a notification
        /// </summary>
        public async Task<YNotification> GetNotificationAsync(Guid id)
        {
            using CosmosClient client = new CosmosClient(accountEndpoint, accountKey, clientOptions);
            var container = client.GetContainer(databaseName, containerName);

            var engine = await container.ReadItemAsync<YNotification>(id.ToString(), engineRequestPartitionKey);

            return engine;
        }



        /// <summary>
        /// Gets all notifications sent to a specific user
        /// </summary>
        public async Task<IEnumerable<YNotification>> GetNotificationsAsync(Guid userId)
        {
            try
            {
                using CosmosClient client = new CosmosClient(accountEndpoint, accountKey, clientOptions);
                var container = client.GetContainer(databaseName, containerName);

                var results = new List<YNotification>();

                QueryDefinition query = new QueryDefinition(
                        "SELECT VALUE c FROM c WHERE c.To = @userId")
                        .WithParameter("@userId", userId);

                var resultSetIterator = container.GetItemQueryIterator<YNotification>(
                query, null, new QueryRequestOptions { PartitionKey = engineRequestPartitionKey });

                while (resultSetIterator.HasMoreResults)
                {
                    FeedResponse<YNotification> response = await resultSetIterator.ReadNextAsync();
                    results.AddRange(response);
                }

                return results;
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                throw;
            }
        }

        public async Task<IEnumerable<YNotification>> GetNotificationsFromLinkAsync(Guid linkId)
        {
            try
            {
                using CosmosClient client = new CosmosClient(accountEndpoint, accountKey, clientOptions);
                var container = client.GetContainer(databaseName, containerName);

                var results = new List<YNotification>();

                QueryDefinition query = new QueryDefinition(
                        "SELECT VALUE c FROM c WHERE c.LinkId = @linkId")
                        .WithParameter("@linkId", linkId);

                var resultSetIterator = container.GetItemQueryIterator<YNotification>(
                query, null, new QueryRequestOptions { PartitionKey = engineRequestPartitionKey });

                while (resultSetIterator.HasMoreResults)
                {
                    FeedResponse<YNotification> response = await resultSetIterator.ReadNextAsync();
                    results.AddRange(response);
                }

                return results;
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                throw;
            }
        }


        public async Task<YNotification> SaveNotificationAsync(YNotification notification)
        {
            try
            {
                using CosmosClient client = new CosmosClient(accountEndpoint, accountKey, clientOptions);
                var container = client.GetContainer(databaseName, containerName);

                ItemResponse<YNotification> response = await container.UpsertItemAsync(
                    notification, engineRequestPartitionKey).ConfigureAwait(false);

                return notification;
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                throw;
            }

        }

        public async Task<bool> DeleteNotificationAsync(Guid id)
        {
            try
            {
                using CosmosClient client = new CosmosClient(accountEndpoint, accountKey, clientOptions);
                var container = client.GetContainer(databaseName, containerName);

                var response = await container.DeleteItemAsync<YNotification>(
                    id.ToString(), engineRequestPartitionKey).ConfigureAwait(false);

                return true;
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                throw;
            }
        }

        public async Task<bool> DeleteAllNotificationsAsync(Guid userId)
        {
            try
            {
                using CosmosClient client = new CosmosClient(accountEndpoint, accountKey, clientOptions);
                var container = client.GetContainer(databaseName, containerName);

                var notifications= new List<YNotification>();

                QueryDefinition query = new QueryDefinition(
                        "SELECT VALUE c FROM c WHERE c.To = @userId")
                        .WithParameter("@userId", userId);

                var resultSetIterator = container.GetItemQueryIterator<YNotification>(
                query, null, new QueryRequestOptions { PartitionKey = engineRequestPartitionKey });

                while (resultSetIterator.HasMoreResults)
                {
                    FeedResponse<YNotification> response = await resultSetIterator.ReadNextAsync().ConfigureAwait(false);
                    notifications.AddRange(response);
                }

                foreach(var notification in notifications)
                {
                    await container.DeleteItemAsync<YNotification>(
                    notification.Id.ToString(), engineRequestPartitionKey).ConfigureAwait(false);
                }

                return true;

            }
            catch (Exception)
            {

                throw;
            }
        }


    }
}
