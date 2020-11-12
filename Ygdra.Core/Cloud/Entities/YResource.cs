using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.Cloud.Entities
{
    public class YResource
    {
        /// <summary> Status is used when creation / modification or deletion is in progress. </summary>
        public string Status { get; set; }

        /// <summary> Resource ID. </summary>
        public string Id { get; set; }

        /// <summary> Resource name. </summary>
        public string Name { get; set; }

        /// <summary> Resource type. </summary>
        public string Type { get; set; }

        /// <summary> Resource location. </summary>
        public string Location { get; set; }

        /// <summary> Resource tags. </summary>
        public IDictionary<string, string> Tags { get; set; }

        /// <summary> The plan of the resource. </summary>
        public YPlan Plan { get; set; }

        /// <summary> The resource properties. </summary>
        public Dictionary<string, object> Properties { get; set; }

        /// <summary> The kind of the resource. </summary>
        public string Kind { get; set; }

        /// <summary> ID of the resource that manages this resource. </summary>
        public string ManagedBy { get; set; }

        /// <summary> The SKU of the resource. </summary>
        public YSku Sku { get; set; }

        /// <summary> The identity of the resource. </summary>
        public YIdentity Identity { get; set; }
    }
}
