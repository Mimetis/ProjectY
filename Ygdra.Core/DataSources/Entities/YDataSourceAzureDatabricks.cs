﻿using Newtonsoft.Json.Linq;
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


        public YDataSourceAzureDatabricks()
        {
            this.DataSourceType = YDataSourceType.AzureDatabricks;

        }
        public YDataSourceAzureDatabricks(YDataSource other) : base(other)
        {
            if (other.DataSourceType != YDataSourceType.AzureDatabricks)
                throw new Exception($"Can't create a type YDataSourceAzureDatabricks from this YDataSource {other}");
        }

        [JsonIgnore]
        public string AccessToken { get; set; }
        [JsonIgnore]
        public string WorkspaceUrl { get; set; }
        [JsonIgnore]
        public string ExistingClusterId { get; set; }

        public override string GetSensitiveString() => this.AccessToken;

        public override void OnDeserialized(JObject properties)
        {
            this.WorkspaceUrl = properties?["typeProperties"]?["workspaceUrl"]?.ToString();
            this.AccessToken = properties?["typeProperties"]?["accessToken"]?.ToString();
            this.ExistingClusterId = properties?["typeProperties"]?["existingClusterId"]?.ToString();
        }

        public override void OnSerializing(JObject properties)
        {
            properties.TryAdd("typeProperties", new JObject());

            var typeProperties = (JObject)properties["typeProperties"];

            typeProperties.Merge("workspaceUrl", this.WorkspaceUrl);
            typeProperties.Merge("accessToken", this.AccessToken);
            typeProperties.Merge("existingClusterId", this.ExistingClusterId);
        }
    }
}
