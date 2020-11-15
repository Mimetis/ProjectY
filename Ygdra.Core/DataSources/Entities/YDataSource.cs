using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Ygdra.Core.DataSources.Entities
{

    public class YDataSources
    {
        public List<YDataSourceUnknown> Value { get; set; }
    }

    public abstract class YDataSource
    {

        public YDataSource()
        {

        }

        public YDataSource(YDataSource other)
        {
            this.Name = other.Name;
            this.Type = other.Type;
            this.DataSourceType = other.DataSourceType;
            this.Description = other.Description;
            this.AdditionalData = other.AdditionalData;

            if (this.AdditionalData?["properties"] is JObject props)
                this.OnDeserialized(props);
        }

        public string Name { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }

        [JsonIgnore]
        public YDataSourceType DataSourceType { get; set; }

        [JsonExtensionData]
        public Dictionary<string, JToken> AdditionalData { get; set; }

        [OnSerializing]
        public void OnSerializing(StreamingContext context)
        {
            if (AdditionalData == null)
                AdditionalData = new Dictionary<string, JToken>();

            AdditionalData.TryAdd("properties", new JObject());

            AdditionalData["properties"]["type"] = Enum.GetName(typeof(YDataSourceType), this.DataSourceType);
            AdditionalData["properties"]["description"] = this.Description;

            this.OnSerializing((JObject)AdditionalData["properties"]);

        }

        [OnDeserialized]
        public void OnDeserialized(StreamingContext context)
        {
            if (AdditionalData == null)
                AdditionalData = new Dictionary<string, JToken>();

            var properties = AdditionalData["properties"];

            if (properties != null)
            {
                if (Enum.TryParse(typeof(YDataSourceType), properties["type"]?.ToString(), out var t))
                    this.DataSourceType = (YDataSourceType)t;
                else
                    this.DataSourceType = YDataSourceType.None;

                this.Description = properties["description"]?.ToString();

                if (properties is JObject props)
                    this.OnDeserialized(props);
            }
        }

        public abstract void OnDeserialized(JObject properties);
        public abstract void OnSerializing(JObject properties);


        public virtual string GetSensitiveString() => null;

    }

    public class YDataSourceUnknown : YDataSource
    {

        public override void OnDeserialized(JObject properties)
        {
        }

        public override void OnSerializing(JObject properties)
        {
        }
    }

}
