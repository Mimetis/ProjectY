using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.Cloud.Entities
{
    public class YUserAssignedIdentity
    {

        /// <summary> The principal id of user assigned identity. </summary>
        public string PrincipalId { get; set; }
        /// <summary> The client id of user assigned identity. </summary>
        public string ClientId { get; set; }
    }
}
