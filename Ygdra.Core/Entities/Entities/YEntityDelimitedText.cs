using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;
using Ygdra.Core.Extensions;

namespace Ygdra.Core.Entities.Entities
{
    public class YEntityDelimitedText : YEntity
    {
        public YEntityDelimitedText(YEntity other = null) : base(other)
        {
            if (other != null && other.EntityType != YEntityType.None && other.EntityType != YEntityType.DelimitedText)
                throw new Exception($"Can't create a type YEntityAzureSqlTable from this YEntity {other}");

            this.EntityType = YEntityType.DelimitedText;
        }

        public Boolean IsForDataLakeGen2 { get; set; }

        public override void OnDeserialized(JObject properties)
        {
            this.FileName = properties?["typeProperties"]?["location"]?["fileName"]?.ToString();
            this.FolderPath = properties?["typeProperties"]?["location"]?["folderPath"]?.ToString();

            // for ADLS Gen 2
            this.FileSystemOrContainer = properties?["typeProperties"]?["location"]?["fileSystem"]?.ToString();

            if (!string.IsNullOrEmpty(this.FileSystemOrContainer))
                this.IsForDataLakeGen2 = true;

            // for blob storage
            this.FileSystemOrContainer = properties?["typeProperties"]?["location"]?["container"]?.ToString();

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

            var location = typeProperties["location"] as JObject;

            location.Merge("type", "AzureBlobFSLocation");
            location.Merge("fileName", this.FileName);
            location.Merge("folderPath", this.FolderPath);

            if (this.IsForDataLakeGen2)
                location.Merge("fileSystem", this.FileSystemOrContainer);
            else
                location.Merge("container", this.FileSystemOrContainer);


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

        public string FileSystemOrContainer { get; set; }
        public string FolderPath { get; set; }
        public string FileName { get; set; }
        public string ColumnDelimiter { get; set; }
        public string RowDelimiter { get; set; }
        public string CompressionCodec { get; set; }
        public string CompressionLevel { get; set; } = "Fastest";
        public string EncodingName { get; set; }
        public string EscapeChar { get; set; }
        public bool FirstRowAsHeader { get; set; }
        public string NullValue { get; set; }
        public string QuoteChar { get; set; }


    }
}
