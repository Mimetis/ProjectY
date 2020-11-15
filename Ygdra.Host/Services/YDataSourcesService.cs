using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Files.DataLake;
using Microsoft.Azure.Cosmos;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Ygdra.Core.DataSources.Entities;
using Ygdra.Host.Controllers;

namespace Ygdra.Host.Services
{
    public class YDataSourcesService : IYDataSourcesService
    {

        public YDataSourcesService()
        {
        }


        public async Task<bool> TestAsync(YDataSource dataSource)
        {
            //var typedDataSource = YDataSourceFactory.GetTypedDatSource(dataSource);



            switch (dataSource.DataSourceType)
            {
                case YDataSourceType.AzureBlobStorage:
                    return await TestBlobAccountConnectionAsync(new YDataSourceAzureBlobStorage(dataSource)).ConfigureAwait(false);
                case YDataSourceType.AzureBlobFS:
                    return await TestBlobAccountConnectionAsync(new YDataSourceAzureBlobFS(dataSource)).ConfigureAwait(false);
                case YDataSourceType.AzureSqlDatabase:
                    return await TestSqlConnectionAsync(new YDataSourceAzureSqlDatabase(dataSource)).ConfigureAwait(false);
                case YDataSourceType.AzureSqlDW:
                    return await TestSqlConnectionAsync(new YDataSourceAzureSqlDW(dataSource)).ConfigureAwait(false);
                case YDataSourceType.AzureDatabricks:
                    break;
                case YDataSourceType.CosmosDb:
                    return await TestCosmosDbAsync(new YDataSourceCosmosDb(dataSource)).ConfigureAwait(false);
                case YDataSourceType.None:
                    break;
            }

            return false;
        }

        private async Task<bool> TestCosmosDbAsync(YDataSourceCosmosDb dataSource)
        {

            using CosmosClient client = new CosmosClient(dataSource.AccountEndpoint, dataSource.AccountKey);
            var db = client.GetDatabase(dataSource.DatabaseName);

            var dbResponse = await db.ReadAsync();

            if (dbResponse.StatusCode != HttpStatusCode.OK)
                throw new Exception($"Can't get CosmosDb database {dataSource.DatabaseName} from endpoint {dataSource.AccountEndpoint}");

            return true;
        }
        private async Task<bool> TestSqlConnectionAsync(YDataSourceAzureSql dataSource)
        {
            SqlConnection sqlConnection = null;

            try
            {

                using (sqlConnection = new SqlConnection(dataSource.ConnectionString))
                {
                    await sqlConnection.OpenAsync().ConfigureAwait(false);
                    return true;
                }

            }
            catch (Exception)
            {
                if (sqlConnection != null && sqlConnection.State != System.Data.ConnectionState.Closed)
                    sqlConnection.Close();

                throw;
            }
        }

        private async Task<bool> TestBlobAccountConnectionAsync(YDataSourceAzureBlob dataSource)
        {
            StorageSharedKeyCredential sharedKeyCredential = new StorageSharedKeyCredential(dataSource.StorageAccountName, dataSource.StorageAccountKey);

            string dfsUri = $"https://{dataSource.StorageAccountName }.blob.core.windows.net";

            var blobServiceClient = new BlobServiceClient(new Uri(dfsUri), sharedKeyCredential);

            var account = await blobServiceClient.GetAccountInfoAsync();

            return true;

        }
       
    }
}