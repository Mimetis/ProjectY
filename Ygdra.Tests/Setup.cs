using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Tests
{
    public class Setup
    {
        private static IConfigurationRoot configuration;

        static Setup()
        {
            configuration = new ConfigurationBuilder()
              .AddJsonFile("appsettings.json", false, true)
              .AddJsonFile("appsettings.local.json", true, true)
              .Build();

        }

        /// <summary>
        /// Returns the database connection string for Sql
        /// </summary>
        internal static string GetSqlDatabaseConnectionString(string dbName)
        {
            var cstring = string.Format(configuration.GetSection("ConnectionStrings")["SqlConnection"], dbName);

            var builder = new SqlConnectionStringBuilder(cstring);

            if (IsOnAzureDev)
            {
                builder.IntegratedSecurity = false;
                builder.DataSource = @"localhost";
                builder.UserID = "sa";
                builder.Password = "Password12!";
            }

            return builder.ToString();

        }
        /// <summary>
        /// Returns the database connection string for Sql
        /// </summary>
        internal static string GetCosmosDbConnectionString()
        {
            return configuration.GetSection("ConnectionStrings")["CosmosDbConnection"];
        }

        /// <summary>
        /// Returns the database connection string for Azure Sql
        /// </summary>
        internal static string GetSqlAzureDatabaseConnectionString(string dbName) =>
            string.Format(configuration.GetSection("ConnectionStrings")["AzureSqlConnection"], dbName);

        /// <summary>
        /// Gets if the tests are running on Azure Dev
        /// </summary>
        internal static bool IsOnAzureDev
        {
            get
            {
                // check if we are running on appveyor or not
                string isOnAzureDev = Environment.GetEnvironmentVariable("AZUREDEV");
                return !string.IsNullOrEmpty(isOnAzureDev) && isOnAzureDev.ToLowerInvariant() == "true";
            }
        }

    }

}
