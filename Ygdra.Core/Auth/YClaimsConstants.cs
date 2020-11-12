﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.Auth
{
    /// <summary>
    /// Constants for claim types.
    /// </summary>
    public static class YClaimConstants
    {
        /// <summary>
        /// Name claim: "name".
        /// </summary>
        public const string Name = "name";

        /// <summary>
        /// Old Object Id claim: http://schemas.microsoft.com/identity/claims/objectidentifier.
        /// </summary>
        public const string ObjectId = "http://schemas.microsoft.com/identity/claims/objectidentifier";

        /// <summary>
        /// New Object id claim: "oid".
        /// </summary>
        public const string Oid = "oid";

        /// <summary>
        /// PreferredUserName: "preferred_username".
        /// </summary>
        public const string PreferredUserName = "preferred_username";

        /// <summary>
        /// Old TenantId claim: "http://schemas.microsoft.com/identity/claims/tenantid".
        /// </summary>
        public const string TenantId = "http://schemas.microsoft.com/identity/claims/tenantid";

        /// <summary>
        /// New Tenant Id claim: "tid".
        /// </summary>
        public const string Tid = "tid";

        /// <summary>
        /// ClientInfo claim: "client_info".
        /// </summary>
        public const string ClientInfo = "client_info";

        /// <summary>
        /// UniqueObjectIdentifier: "uid".
        /// Home Object Id.
        /// </summary>
        public const string UniqueObjectIdentifier = "uid";

        /// <summary>
        /// UniqueTenantIdentifier: "utid".
        /// Home Tenant Id.
        /// </summary>
        public const string UniqueTenantIdentifier = "utid";

        /// <summary>
        /// Older scope claim: "http://schemas.microsoft.com/identity/claims/scope".
        /// </summary>
        public const string Scope = "http://schemas.microsoft.com/identity/claims/scope";

        /// <summary>
        /// Newer scope claim: "scp".
        /// </summary>
        public const string Scp = "scp";

        /// <summary>
        /// New Roles claim = "roles".
        /// </summary>
        public const string Roles = "roles";

        /// <summary>
        /// Old Role claim: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role".
        /// </summary>
        public const string Role = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

        /// <summary>
        /// Subject claim: "sub".
        /// </summary>
        public const string Sub = "sub";

        /// <summary>
        /// Acr claim: "acr".
        /// </summary>
        public const string Acr = "acr";

        /// <summary>
        /// UserFlow claim: "http://schemas.microsoft.com/claims/authnclassreference".
        /// </summary>
        public const string UserFlow = "http://schemas.microsoft.com/claims/authnclassreference";

        /// <summary>
        /// Tfp claim: "tfp".
        /// </summary>
        public const string Tfp = "tfp";
    }
}
