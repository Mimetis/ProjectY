using Microsoft.Identity.Web;
using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.Options
{
    public class YMicrosoftIdentityOptions : MicrosoftIdentityOptions
    {
        /// <summary>
        /// Gets or Sets the subscription id used to access management api
        /// </summary>
        public string SubscriptionId { get; set; }

        /// <summary>
        /// Gets or Sets the ClientId user identifier
        /// </summary>
        public string ClientObjectId { get; set; }
    }
}
