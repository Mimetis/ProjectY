using Newtonsoft.Json;
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
        public Parameters Parameters { get; set; } = new Parameters();
        [JsonProperty("annotations")]
        public List<string> Annotations { get; set; } = new List<string>();
    }

    public class Parameters
    {
        [JsonProperty("windowStart")]
        public WindowStart WindowStart { get; set; } = new WindowStart();
        [JsonProperty("destinationContainer")]
        public DestinationContainer DestinationContainer { get; set; } = new DestinationContainer();
        [JsonProperty("destinationFolderPath")]
        public DestinationFolderpath DestinationFolderPath { get; set; } = new DestinationFolderpath();
    }

    public class WindowStart
    {
        [JsonProperty("type")]
        public string Type { get; set; } = "String";
        [JsonProperty("defaultValue")]
        public DateTime DefaultValue { get; set; } = DateTime.Now;
    }

    public class DestinationContainer
    {
        [JsonProperty("type")]
        public string Type { get; set; } = "string";
        [JsonProperty("defaultValue")]
        public string DefaultValue { get; set; }
    }

    public class DestinationFolderpath
    {
        [JsonProperty("type")]
        public string Type { get; set; } = "string";
        [JsonProperty("defaultValue")]
        public string DefaultValue { get; set; }
    }

    public class Activity
    {
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("type")]
        public string Type { get; set; }
        [JsonProperty("dependsOn")]
        public object[] DependsOn { get; set; }
        [JsonProperty("policy")]
        public Policy Policy { get; set; } = new Policy();
        [JsonProperty("userProperties")]
        public object[] UserProperties { get; set; }
        [JsonProperty("typeProperties")]
        public TypeProperties TypeProperties { get; set; } = new TypeProperties();
        [JsonProperty("inputs")]
        public List<Input> Inputs { get; set; } = new List<Input>();
        [JsonProperty("outputs")]
        public List<Output> Outputs { get; set; } = new List<Output>();
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

    public class TypeProperties
    {
        [JsonProperty("source")]
        public Source Source { get; set; } = new Source();
        [JsonProperty("sink")]
        public Sink Sink { get; set; } = new Sink();
        [JsonProperty("enableStaging")]
        public bool EnableStaging { get; set; } = false;
        [JsonProperty("validateDataConsistency")]
        public bool ValidateDataConsistency { get; set; } = false;
    }

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

    public class Input
    {
        [JsonProperty("referenceName")]
        public string ReferenceName { get; set; }
        [JsonProperty("type")]
        public string Type { get; set; }
    }

    public class Output
    {
        [JsonProperty("referenceName")]
        public string ReferenceName { get; set; }
        [JsonProperty("type")]
        public string Type { get; set; }
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
