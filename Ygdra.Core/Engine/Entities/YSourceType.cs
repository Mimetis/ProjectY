using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.Engine.Entities
{

    /// <summary>
    /// Data souces type available as input
    /// </summary>
    public enum YSourceType
    {
        None = 0,
        AzureSql,
        AzureBlobStorage,
        SqlServer,
        AdlsGen1,
        AdlsGen2,
        CosmosDB,
        Kusto
    }

}
