using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.Enumerations
{
    public enum YResourceIdentityType
    {
        /// <summary> SystemAssigned. </summary>
        SystemAssigned,
        /// <summary> None. </summary>
        None,
        /// <summary> UserAssigned. </summary>
        UserAssigned,
        /// <summary> SystemAssigned, UserAssigned. </summary>
        SystemAssignedUserAssigned
    }
}
