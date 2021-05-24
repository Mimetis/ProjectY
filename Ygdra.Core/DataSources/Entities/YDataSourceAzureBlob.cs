using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;
using System.Text.Json.Serialization;
using Ygdra.Core.Extensions;

namespace Ygdra.Core.DataSources.Entities
{
    public abstract class YDataSourceAzureBlob : YDataSource
    {
        public YDataSourceAzureBlob() { }
        public YDataSourceAzureBlob(YDataSource dataSource) : base(dataSource) { }

        [JsonIgnore]
        public string StorageAccountName { get; set; }

        [JsonIgnore]
        public string StorageAccountKey { get; set; }

        public override string GetSensitiveString() => this.StorageAccountKey;

    
    }


    /// <summary>
    /// Azure Blob Storage Data Source
    /// </summary>
    public class YDataSourceAzureBlobStorage : YDataSourceAzureBlob
    {
        public YDataSourceAzureBlobStorage(YDataSource dataSource) : base(dataSource) 
            => DataSourceType = YDataSourceType.AzureBlobStorage;
        public YDataSourceAzureBlobStorage() 
            => DataSourceType = YDataSourceType.AzureBlobStorage;

        public override void OnDeserialized(JObject properties)
        {
            this.StorageAccountKey = properties?["typeProperties"]?["accountKey"]?.ToString();

            var storageUrl = properties?["typeProperties"]?["url"]?.ToString();

            if (!string.IsNullOrEmpty(storageUrl))
                this.StorageAccountName = storageUrl.Replace("https://", "").Replace(".blob.core.windows.net", "");
        }

        public override void OnSerializing(JObject properties)
        {
            properties.TryAdd("typeProperties", new JObject());

            var typeProperties = (JObject)properties["typeProperties"];

            if (!string.IsNullOrEmpty(this.StorageAccountName))
            {
                var storageUrl = this.StorageAccountName.ToLower().StartsWith("https://") ? this.StorageAccountName : $"https://{this.StorageAccountName}";
                storageUrl = storageUrl.EndsWith(".blob.core.windows.net") ? storageUrl : $"{storageUrl}.blob.core.windows.net";
                typeProperties.Merge("url", storageUrl);

                typeProperties.Merge("connectionString", $"DefaultEndpointsProtocol=https;AccountName={this.StorageAccountName};AccountKey={this.StorageAccountKey};EndpointSuffix=core.windows.net;");
            }



        }
    }

    /// <summary>
    /// Azure Data Lake Gen 2 Storage Data Source
    /// </summary>
    public class YDataSourceAzureBlobFS : YDataSourceAzureBlob
    {
        public YDataSourceAzureBlobFS(YDataSource dataSource) : base(dataSource) 
            => DataSourceType = YDataSourceType.AzureBlobFS;
        public YDataSourceAzureBlobFS() 
            => DataSourceType = YDataSourceType.AzureBlobFS;

        public override void OnDeserialized(JObject properties)
        {
            this.StorageAccountKey = properties?["typeProperties"]?["accountKey"]?.ToString();

            var storageUrl = properties?["typeProperties"]?["url"]?.ToString();

            if (!string.IsNullOrEmpty(storageUrl))
                this.StorageAccountName = storageUrl.Replace("https://", "").Replace(".dfs.core.windows.net", "");
        }

        public override void OnSerializing(JObject properties)
        {
            properties.TryAdd("typeProperties", new JObject());

            var typeProperties = (JObject)properties["typeProperties"];

            typeProperties.Merge("accountKey", this.StorageAccountKey);

            if (!string.IsNullOrEmpty(this.StorageAccountName))
            {
                var storageUrl = this.StorageAccountName.ToLower().StartsWith("https://") ? this.StorageAccountName : $"https://{this.StorageAccountName}";
                storageUrl = storageUrl.EndsWith(".dfs.core.windows.net") ? storageUrl : $"{storageUrl}.dfs.core.windows.net";
                typeProperties.Merge("url", storageUrl);
            }

        }
    }

}
