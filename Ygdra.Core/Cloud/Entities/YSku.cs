using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.Cloud.Entities
{
    public class YSku
    {
        /// <summary> The SKU name. </summary>
        public string Name { get; set; }
        /// <summary> The SKU tier. </summary>
        public string Tier { get; set; }
        /// <summary> The SKU size. </summary>
        public string Size { get; set; }
        /// <summary> The SKU family. </summary>
        public string Family { get; set; }
        /// <summary> The SKU model. </summary>
        public string Model { get; set; }
        /// <summary> The SKU capacity. </summary>
        public int? Capacity { get; set; }

    }
}
