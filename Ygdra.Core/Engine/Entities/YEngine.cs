using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ygdra.Core.Engine.Entities
{

    public class YEngine
    {
        public YEngine()
        {

        }

        /// <summary>
        /// Gets or Sets the Engine Id. Should come from an engine request id
        /// </summary>
        [Key]
        [JsonProperty("id")]
        public Guid Id { get; set; }


        /// <summary>
        /// Gets or Sets the user readable engine name
        /// </summary>
        public string EngineName { get; set; }

        /// <summary>
        /// Gets the partition key value
        /// </summary>
        public string Type => YType.Engine.ToString();

        /// <summary>
        /// Gets or Sets the engine's status.
        /// </summary>
        public YEngineStatus Status { get; set; }


        /// <summary>
        /// Gets or Sets the engine type.
        /// </summary>
        public YEngineType EngineType { get; set; }

        /// <summary>
        /// Gets or sets the resource group location
        /// </summary>
        public string Location { get; set; }

        /// <summary>
        /// Gets or Sets the tags applied the resource group 
        /// </summary>
        public IDictionary<string, string> Tags { get; set; }

        /// <summary>
        /// Gets or Sets the resource group name
        /// </summary>
        public string ResourceGroupName { get; set; }

        public ICollection<YPerson> Owners { get; set; }
        public ICollection<YPerson> Members { get; set; }

        public string ClusterName { get; set; }
        public string FactoryName { get; set; }
        public string KeyVaultName { get; set; }
        public string StorageName { get; set; }


        public string Comments { get; set; }
        public string AdminComments { get; set; }


        /// <summary>
        /// Gets or Sets the last engine update date 
        /// </summary>
        public DateTime? UpdateDate { get; set; }
        /// <summary>
        /// Gets or Sets the date of the request creation
        /// </summary>
        public DateTime? RequestDate { get; set; }

        /// <summary>
        /// Gets or Sets the date of the engine's deployment
        /// </summary>
        public DateTime? DeploymentDate { get; set; }

        /// <summary>
        /// Gets or Sets the status log if any
        /// </summary>
        public string StatusLog { get; set; }
    }

}
