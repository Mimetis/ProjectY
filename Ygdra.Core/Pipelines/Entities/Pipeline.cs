using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;

namespace Ygdra.Core.Pipelines.Entities
{

    public class Pipeline
    {
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("properties")]
        public Properties Properties { get; set; } = new Properties();
    }

    public class Properties
    {
        [JsonProperty("activities")]
        public List<Activity> Activities { get; set; } = new List<Activity>();
        [JsonProperty("parameters")]
        public JObject Parameters { get; set; } = new JObject();
        [JsonProperty("annotations")]
        public List<string> Annotations { get; set; } = new List<string>();
    }


    public class Parameter
    {
        [JsonProperty("type")]
        public string Type { get; set; } = "String";

        [JsonProperty("defaultValue")]
        public Object DefaultValue { get; set; }
    }


    public class Activity
    {
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("type")]
        public string Type { get; set; }
        [JsonProperty("dependsOn")]
        public List<DependsOn> DependsOn { get; set; } = new List<DependsOn>();
        [JsonProperty("policy")]
        public Policy Policy { get; set; } = new Policy();
        [JsonProperty("userProperties")]
        public object[] UserProperties { get; set; }
        [JsonProperty("typeProperties")]
        public JObject TypeProperties { get; set; } = new JObject();
        [JsonProperty("inputs")]
        public List<Reference> Inputs { get; set; }
        [JsonProperty("outputs")]
        public List<Output> Outputs { get; set; }

        [JsonProperty("linkedServiceName")]
        public Reference LinkedServiceName { get; set; }
    }


    public class DependsOn
    {
        [JsonProperty("activity")]
        public string Activity { get; set; }

        [JsonProperty("dependencyConditions")]
        public List<string> DependencyConditions { get; set; } = new List<string>();
    }


    public class Policy
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

    //public class TypeProperties
    //{
    //    [JsonProperty("source")]
    //    public Source Source { get; set; } = new Source();
    //    [JsonProperty("sink")]
    //    public Sink Sink { get; set; } = new Sink();
    //    [JsonProperty("enableStaging")]
    //    public bool EnableStaging { get; set; } = false;
    //    [JsonProperty("validateDataConsistency")]
    //    public bool ValidateDataConsistency { get; set; } = false;
    //}

    public class Source
    {
        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("storeSettings")]
        public StoreSettings StoreSettings { get; set; }
        
        [JsonProperty("partitionOption")]
        public string PartitionOption { get; set; }
    }

    public class StoreSettings
    {
        [JsonProperty("type")]
        public string Type { get; set; }
        [JsonProperty("recursive")]
        public bool Recursive { get; set; }
        [JsonProperty("wildcardFileName")]
        public string WildcardFileName { get; set; }
    }

    public class Sink
    {
        [JsonProperty("type")]
        public string Type { get; set; }
        [JsonProperty("storeSettings")]
        public StoreSettings1 StoreSettings { get; set; } = new StoreSettings1();
        [JsonProperty("formatSettings")]
        public FormatSettings FormatSettings { get; set; } = new FormatSettings();
    }

    public class StoreSettings1
    {
        [JsonProperty("type")]
        public string Type { get; set; }
    }

    public class FormatSettings
    {
        [JsonProperty("type")]
        public string Type { get; set; }
    }

    public class Reference
    {
        [JsonProperty("referenceName")]
        public string ReferenceName { get; set; }
        [JsonProperty("type")]
        public string Type { get; set; }
    }

    public class Output : Reference
    {
        [JsonProperty("parameters")]
        public Parameters1 Parameters { get; set; } = new Parameters1();
    }

    public class Parameters1
    {
        [JsonProperty("folderPath")]
        public FolderPath FolderPath { get; set; } = new FolderPath();
        [JsonProperty("fileSystem")]
        public FileSystem FileSystem { get; set; } = new FileSystem();
    }

    public class FolderPath
    {
        [JsonProperty("value")]
        public string Value { get; set; }
        [JsonProperty("type")]
        public string Type { get; set; }
    }

    public class FileSystem
    {
        [JsonProperty("value")]
        public string Value { get; set; }
        [JsonProperty("type")]
        public string Type { get; set; }
    }

}
