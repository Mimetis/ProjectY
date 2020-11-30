using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.Triggers.Entities
{

    public class YTriggers
    {
        [JsonProperty("value")]
        public List<YTrigger> Value { get; set; }
    }

    public class YTrigger
    {
        [JsonProperty("properties")]
        public YTriggerProperties Properties { get; set; } = new YTriggerProperties();
    }


    public class YTriggerProperties
    {
        [JsonProperty("annotations")]
        public object[] Annotations { get; set; }
        
        [JsonProperty("runtimeState")]
        public string RuntimeState { get; set; }

        [JsonProperty("pipelines")]
        public List<YTriggerTriggerPipeline> Pipelines { get; set; } = new List<YTriggerTriggerPipeline>();

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("typeProperties")]
        public YTriggerTypeProperties TypeProperties { get; set; } = new YTriggerTypeProperties();
    }

    public class YTriggerTypeProperties
    {
        [JsonProperty("recurrence")]
        public YTriggerRecurrence Recurrence { get; set; } = new YTriggerRecurrence();
    }

    public class YTriggerRecurrence
    {
        [JsonProperty("frequency")]
        public string Frequency { get; set; } = "Hour";

        [JsonProperty("interval")]
        public int Interval { get; set; } = 1;

        [JsonProperty("startTime")]
        public string StartTime { get; set; } = DateTime.Now.ToUniversalTime().AddHours(-1).AddMinutes(2).ToString("yyyy-MM-ddTHH:mm:ssZ");

        [JsonProperty("timeZone")]
        public string TimeZone { get; set; } = "UTC";
    }

    public class YTriggerTriggerPipeline
    {
        [JsonProperty("pipelineReference")]
        public YTriggerPipelineReference PipelineReference { get; set; } = new YTriggerPipelineReference();

        [JsonProperty("parameters")]
        public JObject Parameters { get; set; }
    }

    public class YTriggerPipelineReference
    {
        [JsonProperty("referenceName")]
        public string ReferenceName { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; } = "PipelineReference";
    }

}
