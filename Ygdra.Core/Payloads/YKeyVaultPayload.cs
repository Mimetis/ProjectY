using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Ygdra.Core.Payloads
{
    public class YKeyVaultPayload
    {
        [Required]
        public Guid EngineId { get; set; }
        [Required]
        public string Location { get; set; }
    }
}
