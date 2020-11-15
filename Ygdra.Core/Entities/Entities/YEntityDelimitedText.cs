using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;
using Ygdra.Core.Extensions;

namespace Ygdra.Core.Entities.Entities
{
    public class YEntityDelimitedText : YEntity
    {
        public YEntityDelimitedText() : base() => this.EntityType = YEntityType.DelimitedText;

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

            // for ADLS Gen 2
            this.FileSystem = properties?["typeProperties"]?["location"]?["fileSystem"]?.ToString();

            // for blob storage
            this.Container = properties?["typeProperties"]?["location"]?["container"]?.ToString();

            // Properties

            this.ColumnDelimiter = properties?["typeProperties"]?["columnDelimiter"]?.ToString();
            this.RowDelimiter = properties?["typeProperties"]?["rowDelimiter"]?.ToString();
            this.CompressionCodec = properties?["typeProperties"]?["compressionCodec"]?.ToString();
            this.CompressionLevel = properties?["typeProperties"]?["compressionLevel"]?.ToString();
            this.EncodingName = properties?["typeProperties"]?["encodingName"]?.ToString();
            this.EscapeChar = properties?["typeProperties"]?["escapeChar"]?.ToString();
            this.NullValue = properties?["typeProperties"]?["nullValue"]?.ToString();
            this.QuoteChar = properties?["typeProperties"]?["quoteChar"]?.ToString();

            var property = properties?["typeProperties"]?["firstRowAsHeader"] as JProperty;

            this.FirstRowAsHeader = property != null && property.Value<bool>();
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

            if (!string.IsNullOrEmpty(this.FileSystem) && this.FileSystem.ToLowerInvariant() != "none")
                location.Merge("fileSystem", this.FileSystem);

            if (!string.IsNullOrEmpty(this.Container) && this.Container.ToLowerInvariant() != "none")
                location.Merge("container", this.Container);

            // Properties

            if (!string.IsNullOrEmpty(this.ColumnDelimiter) && this.ColumnDelimiter.ToLowerInvariant() != "none")
                typeProperties.Merge("columnDelimiter", this.ColumnDelimiter);

            if (!string.IsNullOrEmpty(this.RowDelimiter) && this.RowDelimiter.ToLowerInvariant() != "none")
                typeProperties.Merge("rowDelimiter", this.RowDelimiter);

            if (!string.IsNullOrEmpty(this.CompressionCodec) && this.CompressionCodec.ToLowerInvariant() != "none")
                typeProperties.Merge("compressionCodec", this.CompressionCodec);

            if (!string.IsNullOrEmpty(this.CompressionLevel) && this.CompressionLevel.ToLowerInvariant() != "none")
                typeProperties.Merge("compressionLevel", this.CompressionLevel);

            if (!string.IsNullOrEmpty(this.EncodingName) && this.EncodingName.ToLowerInvariant() != "none")
                typeProperties.Merge("encodingName", this.EncodingName);

            if (!string.IsNullOrEmpty(this.EscapeChar) && this.EscapeChar.ToLowerInvariant() != "none")
                typeProperties.Merge("escapeChar", this.EscapeChar);

            if (this.FirstRowAsHeader)
                typeProperties.Merge("firstRowAsHeader", this.FirstRowAsHeader);

            if (!string.IsNullOrEmpty(this.NullValue) && this.NullValue.ToLowerInvariant() != "none")
                typeProperties.Merge("nullValue", this.NullValue);

            if (!string.IsNullOrEmpty(this.QuoteChar) && this.QuoteChar.ToLowerInvariant() != "none")
                typeProperties.Merge("quoteChar", this.QuoteChar);
        }


        [JsonIgnore]
        public YEntityLocationType LocationType { get; set; }

        [JsonIgnore]
        public string FileSystem { get; set; }
        [JsonIgnore]
        public string Container { get; set; }
        [JsonIgnore]
        public string FolderPath { get; set; }
        [JsonIgnore]
        public string FileName { get; set; }
        [JsonIgnore]
        public string ColumnDelimiter { get; set; }
        [JsonIgnore]
        public string RowDelimiter { get; set; }
        [JsonIgnore]
        public string CompressionCodec { get; set; }
        [JsonIgnore]
        public string CompressionLevel { get; set; } = "Fastest";
        [JsonIgnore]
        public string EncodingName { get; set; }
        [JsonIgnore]
        public string EscapeChar { get; set; }
        [JsonIgnore]
        public bool FirstRowAsHeader { get; set; }
        [JsonIgnore]
        public string NullValue { get; set; }
        [JsonIgnore]
        public string QuoteChar { get; set; }


    }
}
