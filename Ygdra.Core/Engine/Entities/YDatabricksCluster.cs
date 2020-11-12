using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.Engine.Entities
{

    public class YDatabricksClusters
    {
        [JsonProperty("clusters")]
        public List<YDatabricksCluster> Clusters { get; set; }

    }

    public class YDatabricksCluster
    {
        [JsonProperty("cluster_id")]
        public string ClusterId { get; set; }

        [JsonProperty("spark_context_id")]
        public long SparkContextId { get; set; }

        [JsonProperty("cluster_name")]
        public string ClusterName { get; set; }

        [JsonProperty("spark_version")]
        public string SparkVersion { get; set; }

        [JsonProperty("spark_conf")]
        public Dictionary<string, string> SparkConf { get; set; }

        [JsonProperty("node_type_id")]
        public string NodeTypeId { get; set; }

        [JsonProperty("driver_node_type_id")]
        public string DriverNodeTypeId { get; set; }

        [JsonProperty("spark_env_vars")]
        public Dictionary<string, string> SparkEnvVars { get; set; }

        [JsonProperty("autotermination_minutes")]
        public long AutoterminationMinutes { get; set; }

        [JsonProperty("enable_elastic_disk")]
        public bool EnableElasticDisk { get; set; }

        [JsonProperty("disk_spec")]
        public Dictionary<string, string> DiskSpec { get; set; }

        [JsonProperty("cluster_source")]
        public string ClusterSource { get; set; }

        [JsonProperty("enable_local_disk_encryption")]
        public bool EnableLocalDiskEncryption { get; set; }

        [JsonProperty("azure_attributes")]
        public Dictionary<string, string> AzureAttributes { get; set; }

        [JsonProperty("state")]
        public string State { get; set; }

        [JsonProperty("state_message")]
        public string StateMessage { get; set; }

        [JsonProperty("start_time")]
        public long StartTime { get; set; }

        [JsonProperty("terminated_time")]
        public long TerminatedTime { get; set; }

        [JsonProperty("last_state_loss_time")]
        public long LastStateLossTime { get; set; }

        [JsonProperty("autoscale")]
        public Autoscale Autoscale { get; set; }

        [JsonProperty("default_tags")]
        public Dictionary<string, string> DefaultTags { get; set; }

        [JsonProperty("creator_user_name")]
        public string CreatorUserName { get; set; }

        [JsonProperty("termination_reason")]
        public TerminationReason TerminationReason { get; set; }

        [JsonProperty("init_scripts_safe_mode")]
        public bool InitScriptsSafeMode { get; set; }

    }

    public class Autoscale
    {
        [JsonProperty("min_workers")]
        public int MinWorkers { get; set; }
        [JsonProperty("max_workers")]
        public int MaxWorkers { get; set; }
    }

    public class TerminationReason
    {
        [JsonProperty("code")]
        public string Code { get; set; }
        [JsonProperty("parameters")]
        public Dictionary<string, string> Parameters { get; set; }
        [JsonProperty("type")]
        public string Type { get; set; }
    }
}
