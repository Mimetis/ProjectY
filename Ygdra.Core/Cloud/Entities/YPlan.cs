using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.Cloud.Entities
{
    public class YPlan
    {
        /// <summary> The plan ID. </summary>
        public string Name { get; set; }
        /// <summary> The publisher ID. </summary>
        public string Publisher { get; set; }
        /// <summary> The offer ID. </summary>
        public string Product { get; set; }
        /// <summary> The promotion code. </summary>
        public string PromotionCode { get; set; }
        /// <summary> The plan&apos;s version. </summary>
        public string Version { get; set; }

    }
}
