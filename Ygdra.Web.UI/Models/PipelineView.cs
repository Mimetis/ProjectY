using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ygdra.Core.Entities.Entities;
using Ygdra.Core.Pipelines.Entities;

namespace Ygdra.Web.UI.Models
{
    public class PipelineView
    {
        private YPipeline pipeline;

        public string EntityName { get; set; }
        public string DataSourceName { get; set; }
        public string Version { get; set; }
        public string Activities { get; }

        public PipelineView()
        {

        }

        public PipelineView(YPipeline pipeline, string dataSourceName, string entityName)
        {
            this.pipeline = pipeline;
            var name = pipeline.Name.Replace($"{dataSourceName.ToLowerInvariant()}_", "").Replace($"{entityName.ToLowerInvariant()}_", "");

            if (!string.IsNullOrEmpty(name))
                this.Version= name.Replace("_", ".");

            var activities = pipeline.Properties.Activities?.Select(a => a.Name);

            if (activities != null)
                this.Activities = string.Join(", ", activities);

            this.EntityName = entityName;
            this.DataSourceName = dataSourceName;
        }
    }
}
