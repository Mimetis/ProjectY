using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;
using Ygdra.Core.Extensions;

namespace Ygdra.Core.Entities.Entities
{
    public class YEntityParquet : YEntity
    {
        public YEntityParquet() : base() => this.EntityType = YEntityType.Parquet;

        public override void OnDeserialized(JObject properties)
        {
            // Location

            this.FileName = properties?["typeProperties"]?["location"]?["fileName"]?.ToString();
            this.FolderPath = properties?["typeProperties"]?["location"]?["folderPath"]?.ToString();
            var locationTypeString = properties?["typeProperties"]?["location"]?["type"]?.ToString();

            if (!string.IsNullOrEmpty(locationTypeString) && Enum.TryParse<YEntityLocationType>(locationTypeString, out var locationType))
                this.LocationType = locationType;
            else
                this.LocationType = YEntityLocationType.None;

            if (this.LocationType == YEntityLocationType.AzureBlobFSLocation)
                this.Container = properties?["typeProperties"]?["location"]?["fileSystem"]?.ToString();
            else
                this.Container = properties?["typeProperties"]?["location"]?["container"]?.ToString();

            // Properties
            this.CompressionCodec = properties?["typeProperties"]?["compressionCodec"]?.ToString();
        }

        public override void OnSerializing(JObject properties)
        {
            properties.TryAdd("typeProperties", new JObject());

            var typeProperties = (JObject)properties["typeProperties"];

            typeProperties.Merge("location", new JObject());

            // Location

            var location = typeProperties["location"] as JObject;

            if (this.LocationType != YEntityLocationType.None)
                location.Merge("type", Enum.GetName(typeof(YEntityLocationType), this.LocationType));

            if (!string.IsNullOrEmpty(this.FileName) && this.FileName.ToLowerInvariant() != "none")
                location.Merge("fileName", this.FileName);

            if (!string.IsNullOrEmpty(this.FolderPath) && this.FolderPath.ToLowerInvariant() != "none")
                location.Merge("folderPath", this.FolderPath);

            if (!string.IsNullOrEmpty(this.Container) && this.LocationType == YEntityLocationType.AzureBlobFSLocation)
                location.Merge("fileSystem", this.Container);
            else if (!string.IsNullOrEmpty(this.Container))
                location.Merge("container", this.Container);

            // Properties

            if (!string.IsNullOrEmpty(this.CompressionCodec) && this.CompressionCodec.ToLowerInvariant() != "none")
                typeProperties.Merge("compressionCodec", this.CompressionCodec);

        }


        [JsonIgnore]
        public YEntityLocationType LocationType { get; set; }

        [JsonIgnore]
        public string Container { get; set; }
        [JsonIgnore]
        public string FolderPath { get; set; }
        [JsonIgnore]
        public string FileName { get; set; }
        [JsonIgnore]
        public string CompressionCodec { get; set; }

    }
}
