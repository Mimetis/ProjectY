using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Ygdra.Core.DataSources.Entities
{

    public class YDataSourceFactory
    {

        public static YDataSource GetTypedDatSource(YDataSource dataSource)
        {
            switch (dataSource.DataSourceType)
            {
                case YDataSourceType.AzureBlobStorage:
                case YDataSourceType.AzureBlobFS:
                    return new YDataSourceAzureBlobFS(dataSource);
                case YDataSourceType.AzureSqlDatabase:
                case YDataSourceType.AzureSqlDW:
                    return new YDataSourceAzureSqlDatabase(dataSource);
                case YDataSourceType.AzureDatabricks:
                    return new YDataSourceAzureDatabricks(dataSource);
                case YDataSourceType.CosmosDb:
                    return new YDataSourceCosmosDb(dataSource);
                case YDataSourceType.None:
                default:
                    return dataSource;

            }
        }
    }
}