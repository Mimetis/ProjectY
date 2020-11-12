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
    public class YDataSourceAzureSqlDatabase : YDataSource
    {
        public YDataSourceAzureSqlDatabase(YDataSourceType sqlCompatibleType) : base()
        {
            if (sqlCompatibleType != YDataSourceType.AzureSqlDatabase && sqlCompatibleType != YDataSourceType.AzureSqlDW)
                throw new Exception($"Can't create a type YDataSourceAzureSqlDatabase from this YDataSourceType {sqlCompatibleType}");

            this.DataSourceType = sqlCompatibleType;
        }
        public YDataSourceAzureSqlDatabase(YDataSource other = null) : base(other)
        {
            if (other != null && other.DataSourceType  != YDataSourceType.None && other.DataSourceType != YDataSourceType.AzureSqlDatabase && other.DataSourceType != YDataSourceType.AzureSqlDW)
                throw new Exception($"Can't create a type YDataSourceAzureSqlDatabase from this YDataSource {other}");
        }

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


}
