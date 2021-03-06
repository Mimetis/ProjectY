﻿using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;
using System.Text.Json.Serialization;
using Ygdra.Core.Extensions;

namespace Ygdra.Core.DataSources.Entities
{
    public class YDataSourceCosmosDb : YDataSource
    {

        public YDataSourceCosmosDb() => this.DataSourceType = YDataSourceType.CosmosDb;
        public YDataSourceCosmosDb(YDataSource dataSource) : base(dataSource)
                => DataSourceType = YDataSourceType.CosmosDb;

        [JsonIgnore]
        public string AccountKey { get; set; }
        [JsonIgnore]
        public string AccountEndpoint { get; set; }
        [JsonIgnore]
        public string DatabaseName { get; set; }

        public override string GetSensitiveString() => this.AccountKey;

        public override void OnDeserialized(JObject properties)
        {
            this.AccountEndpoint = properties?["typeProperties"]?["accountEndpoint"]?.ToString();
            this.AccountKey = properties?["typeProperties"]?["accountKey"]?.ToString();
            this.DatabaseName = properties?["typeProperties"]?["database"]?.ToString();
        }

        public override void OnSerializing(JObject properties)
        {
            properties.TryAdd("typeProperties", new JObject());

            var typeProperties = (JObject)properties["typeProperties"];

            typeProperties.Merge("accountEndpoint", this.AccountEndpoint);
            typeProperties.Merge("accountKey", this.AccountEndpoint);
            typeProperties.Merge("database", this.AccountEndpoint);
        }
    }
}
