using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;
using Ygdra.Core.Extensions;

namespace Ygdra.Core.Entities.Entities
{


    public class YEntities
    {
        public IList<YEntity> Value { get; set; }
    }

    public class YEntity
    {
        [JsonIgnore]
        public string DataSourceName { get; set; }

        public string Name { get; set; }

        public string Type { get; set; }

        [JsonIgnore]
        public YEntityType EntityType { get; set; }

        [JsonExtensionData]
        public Dictionary<string, JToken> AdditionalData { get; set; }


        [OnSerializing]
        public void OnSerializing(StreamingContext context)
        {
            if (AdditionalData == null)
                AdditionalData = new Dictionary<string, JToken>();

            AdditionalData.TryAdd("properties", new JObject());
            AdditionalData["properties"]["type"] = Enum.GetName(typeof(YEntityType), this.EntityType);

            AdditionalData["properties"].Merge("linkedServiceName", new JObject());
            AdditionalData["properties"]["linkedServiceName"].Merge("type", "LinkedServiceReference");
            AdditionalData["properties"]["linkedServiceName"].Merge("referenceName", DataSourceName);

            this.OnSerializing((JObject)AdditionalData["properties"]);
        }

        public virtual void OnSerializing(JObject properties) { }

        [OnDeserialized]
        public void OnDeserialized(StreamingContext context)
        {
            if (AdditionalData == null)
                AdditionalData = new Dictionary<string, JToken>();

            if (AdditionalData.TryGetValue("properties", out var token))
            {
                if (Enum.TryParse(typeof(YEntityType), AdditionalData?["properties"]?["type"].ToString(), out var t))
                    this.EntityType = (YEntityType)t;
                else
                    this.EntityType = YEntityType.None;

                this.DataSourceName = AdditionalData?["properties"]?["linkedServiceName"]?["referenceName"].ToString();

                this.OnDeserialized((JObject)AdditionalData["properties"]);
            }
        }

        public virtual void OnDeserialized(JObject properties) { }

    }
}
