using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure;
using Azure.Identity;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Files.DataLake;
using Azure.Storage.Files.DataLake.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using Ygdra.Core.Cloud;
using Ygdra.Core.Cloud.Entities;
using Ygdra.Core.DataSources.Entities;
using Ygdra.Core.Engine;
using Ygdra.Core.Http;
using Ygdra.Core.Options;
using Ygdra.Core.Payloads;
using Ygdra.Host.Extensions;

namespace Ygdra.Host.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [Produces("application/json")]
    public class StoragesController : ControllerBase
    {
        private IYResourceClient resourceClient;
        private readonly IYHttpRequestHandler client;
        private readonly IYEngineProvider engineProvider;
        private readonly DataFactoriesController dataFactoriesController;
        private readonly KeyVaultsController keyVaultsController;
        private YMicrosoftIdentityOptions options;
        private const string StorageApiVersion = "2019-06-01";

        public StoragesController(IYResourceClient resourceClient,
            IYHttpRequestHandler client,
            IYEngineProvider engineProvider,
            DataFactoriesController dataFactoriesController,
            KeyVaultsController keyVaultsController,
            IOptions<YMicrosoftIdentityOptions> azureAdOptions)
        {
            this.resourceClient = resourceClient;
            this.client = client;
            this.engineProvider = engineProvider;
            this.dataFactoriesController = dataFactoriesController;
            this.keyVaultsController = keyVaultsController;
            this.options = azureAdOptions.Value;

        }

        [HttpPut()]
        [Route("{engineId}")]
        public async Task<ActionResult<YResource>> CreateStorageAsync(Guid engineId, [FromBody] YStoragePayload payload)
        {
            payload.Location.EnsureLocation();

            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            if (string.IsNullOrEmpty(engine.ResourceGroupName))
                throw new Exception("Resource group name does not exists");

            if (string.IsNullOrEmpty(engine.StorageName))
                throw new Exception("Storage name does not exists");

            // Create Azure Key Vault payload
            var resourceRequest = new YResource
            {
                Location = engine.Location,
                Sku = new YSku { Name = "Standard_GRS" },
                Kind = "StorageV2",
                Properties = new Dictionary<string, object>
                {
                    {"isHnsEnabled" , true },
                    {"accessTier", "Hot" },

                }
            };

            var resourceResponse = await this.resourceClient.StartCreateOrUpdateAsync
                (engine.ResourceGroupName, "Microsoft.Storage", "", "storageAccounts", engine.StorageName, StorageApiVersion, resourceRequest);

            return resourceResponse.Value;

        }

        [HttpDelete()]
        [Route("{engineId}")]
        public async Task<ActionResult<YResource>> DeleteStorageAsync(Guid engineId)
        {

            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            if (string.IsNullOrEmpty(engine.ResourceGroupName))
                throw new Exception("Resource group name does not exists");

            if (string.IsNullOrEmpty(engine.StorageName))
                throw new Exception("Storage name does not exists");

            var resourceResponse = await this.resourceClient.StartDeleteAsync
                (engine.ResourceGroupName, "Microsoft.Storage", "", "storageAccounts", engine.StorageName, StorageApiVersion);

            return resourceResponse.Value;

        }

        [HttpGet()]
        [Route("{engineId}")]
        public async Task<ActionResult<YResource>> GetStorageAsync(Guid engineId)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            if (string.IsNullOrEmpty(engine.ResourceGroupName))
                throw new Exception("Resource group name does not exists");

            if (string.IsNullOrEmpty(engine.StorageName))
                throw new Exception("Storage name does not exists");

            var resourceResponse = await this.resourceClient.GetAsync
                (engine.ResourceGroupName, "Microsoft.Storage", "", "storageAccounts", engine.StorageName, StorageApiVersion).ConfigureAwait(false);

            return resourceResponse.Value;

        }


        [HttpGet()]
        [Route("{engineId}/{dataSourceName}/files")]
        public async Task<ActionResult<JArray>> GetStorageDfsFilesAsync(Guid engineId, string dataSourceName)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            var dataSourceResponse = await this.dataFactoriesController.GetDataSourceAsync(engineId, dataSourceName);

            if (dataSourceResponse.Value == null)
                throw new Exception("DataSource does not exists");

            var dataSource = dataSourceResponse.Value;

            if (dataSource.DataSourceType != YDataSourceType.AzureBlobFS && dataSource.DataSourceType != YDataSourceType.AzureBlobStorage)
                throw new Exception("DataSource is not a Azure Blob or Azure Data Lake Gen2 Data Source.");

            // Get typed instance to get the correct call to GetSensitiveString()
            var typeDataSource = YDataSourceFactory.GetTypedDatSource(dataSource) as YDataSourceAzureBlob;

            var accountKey = await this.keyVaultsController.GetKeyVaultSecret(engineId, dataSource.Name);

            if (accountKey == null || accountKey.Value == null)
                throw new Exception("DataSource Account key is not present in th keyvault");

            StorageSharedKeyCredential sharedKeyCredential = new StorageSharedKeyCredential(typeDataSource.StorageAccountName, accountKey.Value);

            var root = new JArray();

            if (typeDataSource.DataSourceType == YDataSourceType.AzureBlobStorage)
            {
                // be careful, to get account detail, we are targeting ".bob." and not ".dfs"
                string dfsUri = "https://" + typeDataSource.StorageAccountName + ".blob.core.windows.net";

                var blobServiceClient = new BlobServiceClient(new Uri(dfsUri), sharedKeyCredential);

                AsyncPageable<BlobContainerItem> allContainers = blobServiceClient.GetBlobContainersAsync();

                await foreach (var containerItem in allContainers)
                {
                    var blobContainerClient = blobServiceClient.GetBlobContainerClient(containerItem.Name);
                    ListBlobsHierarchicalListing(blobContainerClient, default, default, ref root);
                }
            }
            else
            {
                // be careful, to get account detail, we are targeting ".bob." and not ".dfs"
                string dfsUri = "https://" + typeDataSource.StorageAccountName + ".dfs.core.windows.net";

                var dataLakeServiceClient = new DataLakeServiceClient(new Uri(dfsUri), sharedKeyCredential);

                AsyncPageable<FileSystemItem> allFileSystems = dataLakeServiceClient.GetFileSystemsAsync();

                await foreach (var fileSystemItem in allFileSystems)
                {
                    var fileSystemClient = dataLakeServiceClient.GetFileSystemClient(fileSystemItem.Name);
                    ListFilesHierarchicalListing(fileSystemClient,  ref root);
                }

            }

            return root;
        }

        private static void ListFilesHierarchicalListing(DataLakeFileSystemClient fileSystemClient, ref JArray arrayJson)
        {
            try
            {
                // Call the listing operation and enumerate the result segment.
                // When the continuation token is empty, the last segment has been returned and
                // execution can exit the loop.

                var enumerator = fileSystemClient.GetPaths(null, true).GetEnumerator();

                enumerator.MoveNext();

                PathItem pathItem = enumerator.Current;

                while (pathItem != null)
                {
                    arrayJson.Add(new JObject { { "name", $"{fileSystemClient.Name}/{pathItem.Name}" } });

                    if (!enumerator.MoveNext())
                        break;

                    pathItem = enumerator.Current;
                }

            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                Console.ReadLine();
                throw;
            }
        }


        private static void ListBlobsHierarchicalListing(BlobContainerClient container, string prefix, int? segmentSize, ref JArray arrayJson)
        {
            string continuationToken = null;

            try
            {
                // Call the listing operation and enumerate the result segment.
                // When the continuation token is empty, the last segment has been returned and
                // execution can exit the loop.
                do
                {
                    var resultSegment = container.GetBlobsByHierarchy(prefix: prefix, delimiter: "/").AsPages(continuationToken, segmentSize);

                    foreach (Page<BlobHierarchyItem> blobPage in resultSegment)
                    {
                        // A hierarchical listing may return both virtual directories and blobs.
                        foreach (BlobHierarchyItem blobhierarchyItem in blobPage.Values)
                        {
                            if (blobhierarchyItem.IsPrefix)
                            {
                                // Write out the prefix of the virtual directory.

                                // if hierarchical; uncomment here
                                //var dirArray = new JArray();
                                //arrayJson.Add(new JObject { { blobhierarchyItem.Prefix, dirArray } });
                                //ListBlobsHierarchicalListing(container, blobhierarchyItem.Prefix, null, ref dirArray);

                                // Call recursively with the prefix to traverse the virtual directory.
                                ListBlobsHierarchicalListing(container, blobhierarchyItem.Prefix, null, ref arrayJson);
                            }
                            else
                            {
                                arrayJson.Add(new JObject { { "name", $"{container.Name}/{blobhierarchyItem.Blob.Name}" } });

                            }
                        }

                        Console.WriteLine();

                        // Get the continuation token and loop until it is empty.
                        continuationToken = blobPage.ContinuationToken;
                    }


                } while (continuationToken != "");
            }
            catch (RequestFailedException e)
            {
                Console.WriteLine(e.Message);
                Console.ReadLine();
                throw;
            }
        }

    }
}
