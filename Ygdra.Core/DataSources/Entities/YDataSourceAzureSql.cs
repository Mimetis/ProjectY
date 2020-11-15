using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.Serialization;
using System.Text;
using Ygdra.Core.Extensions;

namespace Ygdra.Core.DataSources.Entities
{
    public abstract class YDataSourceAzureSql : YDataSource
    {
        public YDataSourceAzureSql() { }
        public YDataSourceAzureSql(YDataSource dataSource) : base(dataSource) { }

        [JsonIgnore]
        public string DataSource { get; set; }
        [JsonIgnore]
        public string InitialCatalog { get; set; }
        [JsonIgnore]
        public string UserId { get; set; }
        [JsonIgnore]
        public string Password { get; set; }

        [JsonIgnore]
        public string ConnectionString
        {
            get
            {
                // SqlConnectionStringBuilder will throw an error if we don't have all the parameters
                if (string.IsNullOrEmpty(this.DataSource) ||
                    string.IsNullOrEmpty(this.InitialCatalog) ||
                    string.IsNullOrEmpty(this.UserId) ||
                    string.IsNullOrEmpty(this.Password))
                    return null;

                var dataSource = this.DataSource.ToLowerInvariant().EndsWith(".database.windows.net") ? this.DataSource : $"{this.DataSource}.database.windows.net";

                var b = new SqlConnectionStringBuilder
                {
                    DataSource = dataSource,
                    InitialCatalog = this.InitialCatalog,
                    UserID = this.UserId,
                    Password = this.Password,
                };

                return b.ConnectionString;
            }
            set
            {
                var b = new SqlConnectionStringBuilder(value);

                this.DataSource = b.DataSource.Replace(".database.windows.net", "");
                this.InitialCatalog = b.InitialCatalog;
                this.UserId = b.UserID;
                this.Password = b.Password;

            }
        }

        public override string GetSensitiveString() => this.Password;

        public override void OnDeserialized(JObject properties)
        {
            this.ConnectionString = properties?["typeProperties"]?["connectionString"]?.ToString();
        }

        public override void OnSerializing(JObject properties)
        {
            properties.TryAdd("typeProperties", new JObject());

            var typeProperties = (JObject)properties["typeProperties"];

            typeProperties.Merge("connectionString", this.ConnectionString);
        }
    }

    public class YDataSourceAzureSqlDatabase : YDataSourceAzureSql
    {
        public YDataSourceAzureSqlDatabase() => this.DataSourceType = YDataSourceType.AzureSqlDatabase;

        public YDataSourceAzureSqlDatabase(YDataSource dataSource) : base(dataSource)
             => DataSourceType = YDataSourceType.AzureSqlDatabase;

    }

    public class YDataSourceAzureSqlDW : YDataSourceAzureSql
    {
        public YDataSourceAzureSqlDW() => this.DataSourceType = YDataSourceType.AzureSqlDW;

        public YDataSourceAzureSqlDW(YDataSource dataSource) : base(dataSource)
            => DataSourceType = YDataSourceType.AzureSqlDW;

    }


}
