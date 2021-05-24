using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.Payloads
{
    public class YMetricPayload
    {

        /// <summary>
        /// Gets or Sets Metric namespace. Usually "Entities"
        /// </summary>
        public string Namespace { get; set; }

        /// <summary>
        /// Gets or Sets the Metric Id. Usually "Rows Count" or "Null Count" etc...
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// Gets or Sets the Dimensiosn Name. Usually "Data Source Name", or "Entity Name" or even "Column Name"
        /// </summary>
        public List<YMetricDimensionPayload> Dimensions { get; set; } = new List<YMetricDimensionPayload>();

        /// <summary>
        /// Gets or Sets The Value value
        /// </summary>
        public double Value { get; set; }

    }

    public class YMetricDimensionPayload
    {
        public string Name { get; set; }
        public string Value { get; set; }
    }

    public class YMetricPayload2
    {

        /// <summary>
        /// Gets or Sets Metric namespace. Usually "Entities"
        /// </summary>
        public string Namespace { get; set; }

        /// <summary>
        /// Gets or Sets the Metric Name. Usually "Rows Count" or "Null Count" etc...
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or Sets the Dimensiosn Name. Usually "Data Source Name", or "Entity Name" or even "Column Name"
        /// </summary>
        public List<YMetricDimensionPayload> Dimensions { get; set; } = new List<YMetricDimensionPayload>();

        /// <summary>
        /// Gets or Sets The Sum value
        /// </summary>
        public double Sum { get; set; }

        /// <summary>
        /// Gets or Sets The Count value
        /// </summary>
        public int Count { get; set; }

        /// <summary>
        /// Gets or Sets The Min value
        /// </summary>
        public double Min { get; set; }

        /// <summary>
        /// Gets or Sets The Max value
        /// </summary>
        public double Max { get; set; }

    }



}
