using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.Entities.Entities
{

    /// <summary>
    /// Type of blob location
    /// </summary>
    public enum YEntityLocationType
    {
        None = 0,

        /// <summary>
        /// Location for Blob Storage
        /// </summary>
        AzureBlobStorageLocation,

        /// <summary>
        /// Location for Data Lake Gen 2
        /// </summary>
        AzureBlobFSLocation
    }
}
