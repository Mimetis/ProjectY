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
        public IList<YEntityUnknown> Value { get; set; }
    }

    public abstract class YEntity
    {
        public YEntity()
        {
        }
        public string DataSourceName { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Version { get; set; } = string.Empty;
        public string Mode { get; set; } = "Full";
        public string KeyColumn { get; set; }
        public string TimestampColumn { get; set; }



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

            var annotations = AdditionalData["properties"]["annotations"] as JArray;
            if (annotations == null)
            {
                annotations = new JArray();
                ((JObject)AdditionalData["properties"]).Add("annotations", annotations);
            }

            if (!string.IsNullOrEmpty(this.Version))
            {
                var version = annotations.FirstOrDefault(jt => jt.Value<string>().StartsWith("ProjectY_Version"));
                if (version != null)
                {
                    var indexVersion = annotations.IndexOf(version);
                    annotations[indexVersion] = $"ProjectY_Version={this.Version}";
                }
                else
                {
                    annotations.Add($"ProjectY_Version={this.Version}");
                }
            }
            if (!string.IsNullOrEmpty(this.Mode))
            {
                var version = annotations.FirstOrDefault(jt => jt.Value<string>().StartsWith("ProjectY_Mode"));
                if (version != null)
                {
                    var indexVersion = annotations.IndexOf(version);
                    annotations[indexVersion] = $"ProjectY_Mode={this.Mode}";
                }
                else
                {
                    annotations.Add($"ProjectY_Mode={this.Mode}");
                }
            }

            this.OnSerializing((JObject)AdditionalData["properties"]);
        }

        public abstract void OnSerializing(JObject properties);

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

                if (AdditionalData?["properties"]?["annotations"] is JArray annotations && annotations.Count > 0)
                {
                    var versionString = annotations.FirstOrDefault(t =>
                            ((JValue)t).Value.ToString().StartsWith("ProjectY_Version"));

                    if (versionString != null)
                        this.Version = versionString.ToString().Replace("ProjectY_Version=", "");
                }

                this.OnDeserialized((JObject)AdditionalData["properties"]);
            }
        }

        public abstract void OnDeserialized(JObject properties);

    }


    public class YEntityUnknown : YEntity
    {
        public override void OnDeserialized(JObject properties)
        {

        }

        public override void OnSerializing(JObject properties)
        {

        }
    }

}
