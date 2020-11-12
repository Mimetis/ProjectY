using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.DataSources.Entities
{
    public enum YDataSourceType
    {
        None = 0,
        AzureBlobStorage,
        AzureBlobFS,
        AzureSqlDatabase,
        AzureSqlDW,
        AzureDatabricks,
        CosmosDb
    }
}
