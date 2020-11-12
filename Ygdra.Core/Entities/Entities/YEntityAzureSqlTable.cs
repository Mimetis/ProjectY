using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Ygdra.Core.Extensions;

namespace Ygdra.Core.Entities.Entities
{
    public class YEntityAzureSqlTable : YEntity
    {
        public YEntityAzureSqlTable(YEntity other = null) : base(other)
        {
            if (other == null)
                return;

            if (other.EntityType != YEntityType.None && other.EntityType != YEntityType.AzureSqlTable)
                throw new Exception($"Can't create a type YEntityAzureSqlTable from this YEntity {other}");
        }

        [JsonIgnore]
        public string Schema { get; set; }

        [JsonIgnore]
        public string Table { get; set; }


        public override void OnDeserialized(JObject properties)
        {
            var tableName = properties?["typeProperties"]?["tableName"]?.ToString();

            if (!string.IsNullOrEmpty(tableName))
            {
                var arrayTableName = tableName.Split(".");

                if (arrayTableName.Length > 1)
                {
                    this.Schema = arrayTableName[0];
                    this.Table = arrayTableName[1];
                }
                else
                {
                    this.Table = arrayTableName[0];
                }

            }
            else
            {
                this.Table = properties?["typeProperties"]?["table"]?.ToString();
                this.Schema = properties?["typeProperties"]?["schema"]?.ToString();

            }

            if (!string.IsNullOrEmpty(this.Schema))
                this.Schema = this.Schema.Replace("[", "").Replace("]", "");

            if (!string.IsNullOrEmpty(this.Table))
                this.Table = this.Table.Replace("[", "").Replace("]", "");



        }

        public override void OnSerializing(JObject properties)
        {
            properties.TryAdd("typeProperties", new JObject());

            var typeProperties = (JObject)properties["typeProperties"];

            var table = this.Table;
            if (!string.IsNullOrWhiteSpace(table))
            {
                table = table.StartsWith("[") ? table : $"[{table}";
                table = table.EndsWith("]") ? table : $"{table}]";
            }
            var schema = this.Schema;
            if (!string.IsNullOrWhiteSpace(schema))
            {
                schema = schema.StartsWith("[") ? schema : $"[{schema}";
                schema = schema.EndsWith("]") ? schema : $"{schema}]";
            }

            var tableName = table;
            if (!string.IsNullOrWhiteSpace(schema))
                tableName = $"{schema}.{table}";

            typeProperties.Merge("tableName", tableName);

        }
    }
}
