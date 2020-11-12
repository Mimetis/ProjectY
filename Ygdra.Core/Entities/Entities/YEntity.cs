using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
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
        public YEntity(YEntity other = null)
        {
            if (other == null)
                return;

            this.Name = other.Name;
            this.DataSourceName = other.DataSourceName;
            this.Type = other.Type;
            this.Version = other.Version;
            this.EntityType = other.EntityType;
            this.AdditionalData = other.AdditionalData;

            if (this.AdditionalData?["properties"] is JObject props)
                this.OnDeserialized(props);

        }

        public string DataSourceName { get; set; }

        public string Name { get; set; }

        public string Type { get; set; }

        [JsonIgnore]
        public YEntityType EntityType { get; set; }

        [JsonExtensionData]
        public Dictionary<string, JToken> AdditionalData { get; set; }

        public string Version { get; set; } = string.Empty;


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

            if (!String.IsNullOrEmpty(this.Version))
            {
                var versionArray = new JArray();
                versionArray.Add($"ProjectY_Version={this.Version}");
                AdditionalData["properties"].Merge("annotations", versionArray);
            }

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

                var annotations = AdditionalData?["properties"]?["annotations"] as JArray;

                if (annotations != null && annotations.Count > 0)
                {
                    var versionString = annotations.FirstOrDefault(t => ((JValue)t).Value.ToString().StartsWith("ProjectY_Version"));

                    if (versionString != null)
                        this.Version = versionString.ToString().Replace("ProjectY_Version=", "");
                }



                this.OnDeserialized((JObject)AdditionalData["properties"]);
            }
        }

        public virtual void OnDeserialized(JObject properties) { }

    }
}
