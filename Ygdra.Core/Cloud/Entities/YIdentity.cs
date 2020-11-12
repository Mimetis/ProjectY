using System;
using System.Collections.Generic;
using System.Text;
using Ygdra.Core.Enumerations;

namespace Ygdra.Core.Cloud.Entities
{
    public class YIdentity
    {
        /// <summary> The principal ID of resource identity. </summary>
        public string PrincipalId { get; set; }
        /// <summary> The tenant ID of resource. </summary>
        public string TenantId { get; set; }
        /// <summary> The identity type. </summary>
        public YResourceIdentityType? Type { get; set; }
        /// <summary> The list of user identities associated with the resource. The user identity dictionary key references will be ARM resource ids in the form: &apos;/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}&apos;. </summary>
        public IDictionary<string, YUserAssignedIdentity> UserAssignedIdentities { get; set; }

    }
   
}
