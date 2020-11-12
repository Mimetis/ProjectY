using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Ygdra.Core.Payloads
{
    public class YResourceGroupPayload
    {
        [Required]
        public string EngineId { get; set; }

        [Required]
        public string Location { get; set; }

        public Dictionary<string, string> Tags { get; set; }
    }
}
