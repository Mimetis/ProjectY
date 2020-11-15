using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;
using System.Text.Json.Serialization;
using Ygdra.Core.Extensions;

namespace Ygdra.Core.DataSources.Entities
{
    public class YDataSourceAzureDatabricks : YDataSource
    {

        public YDataSourceAzureDatabricks() => this.DataSourceType = YDataSourceType.AzureDatabricks;

        public YDataSourceAzureDatabricks(YDataSource dataSource) : base(dataSource)
            => DataSourceType = YDataSourceType.AzureDatabricks;


        [JsonIgnore]
        public string AccessToken { get; set; }
        [JsonIgnore]
        public string WorkspaceUrl { get; set; }
        [JsonIgnore]
        public string ExistingClusterId { get; set; }

        public override string GetSensitiveString() => this.AccessToken;

        public override void OnDeserialized(JObject properties)
        {
            var domain = properties?["typeProperties"]?["domain"]?.ToString();

            if (!string.IsNullOrEmpty(domain))
                this.WorkspaceUrl = domain.Replace("https://", "").Replace(".azuredatabricks.net", "");

            this.AccessToken = properties?["typeProperties"]?["accessToken"]?.ToString();
            this.ExistingClusterId = properties?["typeProperties"]?["existingClusterId"]?.ToString();
        }

        public override void OnSerializing(JObject properties)
        {
            properties.TryAdd("typeProperties", new JObject());

            var typeProperties = (JObject)properties["typeProperties"];

            if (!string.IsNullOrEmpty(this.WorkspaceUrl))
            {
                var domain = this.WorkspaceUrl.ToLower().StartsWith("https://") ? this.WorkspaceUrl : $"https://{this.WorkspaceUrl}";
                domain = domain.EndsWith(".azuredatabricks.net") ? domain : $"{domain}.azuredatabricks.net";
                typeProperties.Merge("domain", domain);
            }

            typeProperties.Merge("accessToken", this.AccessToken);
            typeProperties.Merge("existingClusterId", this.ExistingClusterId);
        }
    }
}
