using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;
using Ygdra.Core.Extensions;

namespace Ygdra.Core.Entities.Entities
{
    public class YEntityAzureSqlTable : YEntity
    {

        public YEntityAzureSqlTable()
        {
            this.EntityType = YEntityType.AzureSqlTable;
        }
        public YEntityAzureSqlTable(YEntity other)
        {
            if (other.EntityType!= YEntityType.AzureSqlTable)
                throw new Exception($"Can't create a type YEntityAzureSqlTable from this YEntity {other}");

            this.Name = other.Name;
            this.Type = other.Type;
            this.EntityType = other.EntityType;
            this.AdditionalData = other.AdditionalData;
            this.OnDeserialized(this.AdditionalData?["properties"] as JObject);
        }

        [JsonIgnore]
        public string Schema { get; set; }
        
        [JsonIgnore]
        public string Table { get; set; }



        public override void OnDeserialized(JObject properties)
        {
            this.Schema = properties?["typeProperties"]?["schema"]?.ToString();
            this.Table = properties?["typeProperties"]?["table"]?.ToString();
        }

        public override void OnSerializing(JObject properties)
        {
            properties.TryAdd("typeProperties", new JObject());

            var typeProperties = (JObject)properties["typeProperties"];

            typeProperties.Merge("schema", this.Schema);
            typeProperties.Merge("table", this.Table);
        }
    }
}
