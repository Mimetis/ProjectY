using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;
using Ygdra.Core.Extensions;

namespace Ygdra.Core.Entities.Entities
{
    public class YEntityDelimitedText : YEntity
    {

        public YEntityDelimitedText()
        {
            this.EntityType = YEntityType.DelimitedText;
        }
        public YEntityDelimitedText(YEntity other)
        {
            if (other.EntityType != YEntityType.DelimitedText)
                throw new Exception($"Can't create a type YEntityAzureSqlTable from this YEntity {other}");

            this.Name = other.Name;
            this.Type = other.Type;
            this.EntityType = other.EntityType;
            this.AdditionalData = other.AdditionalData;
            this.OnDeserialized(this.AdditionalData?["properties"] as JObject);
        }

        public override void OnDeserialized(JObject properties)
        {
            this.FileName = properties?["typeProperties"]?["location"]?["fileName"]?.ToString();
            this.FolderPath = properties?["typeProperties"]?["location"]?["folderPath"]?.ToString();
            this.FileSystem = properties?["typeProperties"]?["location"]?["fileSystem"]?.ToString();

            this.ColumnDelimiter = properties?["typeProperties"]?["columnDelimiter"]?.ToString();
            this.RowDelimiter = properties?["typeProperties"]?["rowDelimiter"]?.ToString();
            this.CompressionCodec = properties?["typeProperties"]?["compressionCodec"]?.ToString();
            this.CompressionLevel = properties?["typeProperties"]?["compressionLevel"]?.ToString();
            this.EncodingName = properties?["typeProperties"]?["encodingName"]?.ToString();
            this.EscapeChar = properties?["typeProperties"]?["escapeChar"]?.ToString();
            this.NullValue = properties?["typeProperties"]?["nullValue"]?.ToString();
            this.QuoteChar = properties?["typeProperties"]?["quoteChar"]?.ToString();

            var property = properties?["typeProperties"]?["firstRowAsHeader"] as JProperty;

            this.FirstRowAsHeader = property != null && property.Value<bool>() ;
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
            location.Merge("fileSystem", this.FileSystem);

            typeProperties.Merge("columnDelimiter", this.ColumnDelimiter);
            typeProperties.Merge("rowDelimiter", this.RowDelimiter);
            typeProperties.Merge("compressionCodec", this.CompressionCodec);
            typeProperties.Merge("compressionLevel", this.CompressionLevel);
            typeProperties.Merge("encodingName", this.EncodingName);
            typeProperties.Merge("escapeChar", this.EscapeChar);
            typeProperties.Merge("firstRowAsHeader", this.FirstRowAsHeader);
            typeProperties.Merge("nullValue", this.NullValue);
            typeProperties.Merge("quoteChar", this.QuoteChar);
        }

        public string FileSystem { get; set; }
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








        //        {
        //    "name": "DelimitedText1",
        //    "properties": {
        //        "linkedServiceName": {
        //            "referenceName": "AzureDataLakeStorage2",
        //            "type": "LinkedServiceReference"
        //        },
        //        "annotations": [],
        //        "type": "DelimitedText",
        //        "typeProperties": {
        //            "location": {
        //                "type": "AzureBlobFSLocation",
        //                "fileName": "File",
        //                "folderPath": "Directory",
        //                "fileSystem": "FileSystem"
        //            },
        //            "columnDelimiter": "\t",
        //            "rowDelimiter": "\n",
        //            "compressionCodec": "lz4",
        //            "compressionLevel": "Fastest",
        //            "encodingName": "UTF-7",
        //            "escapeChar": "/",
        //            "firstRowAsHeader": true,
        //            "nullValue": "NULL",
        //            "quoteChar": "\""
        //        },
        //        "schema": []
        //    }
        //}
    }
}
