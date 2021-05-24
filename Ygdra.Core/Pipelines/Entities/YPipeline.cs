using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;

namespace Ygdra.Core.Pipelines.Entities
{

    public class YPipelines
    {
        [JsonProperty("value")]
        public List<YPipeline> Value { get; set; }
    }
    public class YPipeline
    {
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("properties")]
        public YPipelineProperties Properties { get; set; } = new YPipelineProperties();
    }

    public class YPipelineProperties
    {
        [JsonProperty("activities")]
        public List<YPipelineActivity> Activities { get; set; } = new List<YPipelineActivity>();
        [JsonProperty("parameters")]
        public JObject Parameters { get; set; } = new JObject();
        [JsonProperty("annotations")]
        public List<string> Annotations { get; set; } = new List<string>();
    }


    public class YPipelineParameter
    {
        [JsonProperty("type")]
        public string Type { get; set; } = "String";

        [JsonProperty("defaultValue")]
        public Object DefaultValue { get; set; }
    }


    public class YPipelineActivity
    {
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("type")]
        public string Type { get; set; }
        [JsonProperty("dependsOn")]
        public List<YPipelineDependsOn> DependsOn { get; set; } = new List<YPipelineDependsOn>();
        [JsonProperty("policy")]
        public YPipelinePolicy Policy { get; set; } = new YPipelinePolicy();
        [JsonProperty("userProperties")]
        public object[] UserProperties { get; set; }
        [JsonProperty("typeProperties")]
        public JObject TypeProperties { get; set; } = new JObject();
        [JsonProperty("inputs")]
        public List<YPipelineReference> Inputs { get; set; }
        [JsonProperty("outputs")]
        public List<YPipelineOutput> Outputs { get; set; }

        [JsonProperty("linkedServiceName")]
        public YPipelineReference LinkedServiceName { get; set; }
    }


    public class YPipelineDependsOn
    {
        [JsonProperty("activity")]
        public string Activity { get; set; }

        [JsonProperty("dependencyConditions")]
        public List<string> DependencyConditions { get; set; } = new List<string>();
    }


    public class YPipelinePolicy
    {
        [JsonProperty("timeout")]
        public string Timeout { get; set; } = "7.00:00:00";
        [JsonProperty("retry")]
        public int Retry { get; set; } = 0;
        [JsonProperty("retryIntervalInSeconds")]
        public int RetryIntervalInSeconds { get; set; } = 30;
        [JsonProperty("secureOutput")]
        public bool SecureOutput { get; set; } = false;
        [JsonProperty("secureInput")]
        public bool SecureInput { get; set; } = false;
    }

    public class YPipelineSource
    {
        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("storeSettings")]
        public YPipelineStoreSettings StoreSettings { get; set; }
        
        [JsonProperty("partitionOption")]
        public string PartitionOption { get; set; }

        [JsonProperty("sqlReaderQuery")]
        public YValueType SqlReaderQuery { get; set; }

    }

    public class YPipelineStoreSettings
    {
        [JsonProperty("type")]
        public string Type { get; set; }
        [JsonProperty("recursive")]
        public bool Recursive { get; set; }
        [JsonProperty("wildcardFileName")]
        public string WildcardFileName { get; set; }
    }

    public class YPipelineSink
    {
        [JsonProperty("type")]
        public string Type { get; set; }
        [JsonProperty("storeSettings")]
        public YPipelineStoreSettings1 StoreSettings { get; set; } = new YPipelineStoreSettings1();
        [JsonProperty("formatSettings")]
        public YPipelineFormatSettings FormatSettings { get; set; } = new YPipelineFormatSettings();
    }

    public class YPipelineStoreSettings1
    {
        [JsonProperty("type")]
        public string Type { get; set; }
    }

    public class YPipelineFormatSettings
    {
        [JsonProperty("type")]
        public string Type { get; set; }
    }

    public class YPipelineReference
    {
        [JsonProperty("referenceName")]
        public string ReferenceName { get; set; }
        [JsonProperty("type")]
        public string Type { get; set; }
    }

    public class YPipelineOutput : YPipelineReference
    {
        [JsonProperty("parameters")]
        public YPipelineParameters1 Parameters { get; set; } = new YPipelineParameters1();
    }

    public class YPipelineParameters1
    {
        [JsonProperty("folderPath")]
        public YValueType FolderPath { get; set; } = new YValueType();
        [JsonProperty("fileSystem")]
        public YValueType FileSystem { get; set; } = new YValueType();
    }

    public class YValueType
    {
        [JsonProperty("value")]
        public string Value { get; set; }
        [JsonProperty("type")]
        public string Type { get; set; }
    }

   
}
