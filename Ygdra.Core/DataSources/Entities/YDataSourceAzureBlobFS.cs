using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;
using System.Text.Json.Serialization;
using Ygdra.Core.Extensions;

namespace Ygdra.Core.DataSources.Entities
{
    public class YDataSourceAzureBlobFS : YDataSource
    {

        public YDataSourceAzureBlobFS(YDataSource other = null) : base(other)
        {
            if (other != null && other.DataSourceType != YDataSourceType.None && other.DataSourceType != YDataSourceType.AzureBlobFS)
                throw new Exception($"Can't create a type YDataSourceAzureBlobFS from this YDataSource {other}");
        }

        [JsonIgnore]
        public string StorageAccountName { get; set; }

        [JsonIgnore]
        public string StorageAccountKey { get; set; }


        public override string GetSensitiveString() => this.StorageAccountKey;

        public override void OnDeserialized(JObject properties)
        {
            this.StorageAccountKey = properties?["typeProperties"]?["accountKey"]?.ToString();

            var storageUrl = properties?["typeProperties"]?["url"]?.ToString();

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
