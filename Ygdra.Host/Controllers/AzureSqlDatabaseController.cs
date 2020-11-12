using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using Ygdra.Core.Auth;
using Ygdra.Core.Cloud;
using Ygdra.Core.DataSources.Entities;
using Ygdra.Core.Engine;
using Ygdra.Core.Entities.Entities;
using Ygdra.Core.Http;
using Ygdra.Core.Options;

namespace Ygdra.Host.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    [Produces("application/json")]
    public class AzureSqlDatabaseController : ControllerBase
    {
        private IYResourceClient resourceClient;
        private readonly IYAuthProvider authProvider;
        private readonly IYHttpRequestHandler client;
        private readonly IYEngineProvider engineProvider;
        private readonly KeyVaultsController keyVaultsController;
        private readonly DataFactoriesController dataFactoriesController;
        private YMicrosoftIdentityOptions options;
        private const string DataFactoryApiVersion = "2018-06-01";
        private const string DataBricksApiVersion = "2018-04-01";

        public AzureSqlDatabaseController(IYResourceClient resourceClient,
            IYAuthProvider authProvider,
            IYHttpRequestHandler client,
            IYEngineProvider engineProvider,
            IOptions<YMicrosoftIdentityOptions> azureAdOptions,
            KeyVaultsController keyVaultsController,
            DataFactoriesController dataFactoriesController)
        {
            this.resourceClient = resourceClient;
            this.authProvider = authProvider;
            this.client = client;
            this.engineProvider = engineProvider;
            this.keyVaultsController = keyVaultsController;
            this.dataFactoriesController = dataFactoriesController;
            this.options = azureAdOptions.Value;

        }


        [HttpGet()]
        [Route("{engineId}/{dataSourceName}/tables")]
        public async Task<ActionResult<List<YSqlTable>>> GetAzureSqlDatabaseTablesAsync(Guid engineId, string dataSourceName)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            // Get connection string
            var cs = await keyVaultsController.GetKeyVaultSecret(engineId, dataSourceName);

            if (cs == null)
                throw new Exception($"Can't get secret for DataSource {dataSourceName}");


            var dataSource = await this.dataFactoriesController.GetDataSourceAsync(engineId, dataSourceName);

            if (dataSource.Value == null)
                throw new Exception("Can't get datasource");

            var sqlDatabaseSource = YDataSourceFactory.GetTypedDatSource(dataSource.Value) as YDataSourceAzureSqlDatabase;

            if (sqlDatabaseSource == null)
                throw new Exception($"Data Source {dataSourceName} is not a Sql data source");

            sqlDatabaseSource.Password = cs.Value;

            using var sqlConnection = new SqlConnection(sqlDatabaseSource.ConnectionString);

            var tableCommandText = @"Select tbl.name as TableName, sch.name as SchemaName 
                                        From sys.tables as tbl  
                                        Inner join sys.schemas as sch on tbl.schema_id = sch.schema_id";

            var sqlCommand = new SqlCommand(tableCommandText, sqlConnection);

            var entities = new List<YSqlTable>();

            try
            {
                await sqlConnection.OpenAsync();

                using var dr = await sqlCommand.ExecuteReaderAsync();

                while (dr.Read())
                {
                    var ysqlTable = new YSqlTable
                    {
                        TableName = dr["TableName"].ToString(),
                        SchemaName = dr["SchemaName"].ToString()
                    };
                    entities.Add(ysqlTable);
                }


                await sqlConnection.CloseAsync();
            }
            catch (Exception)
            {

                if (sqlConnection.State != System.Data.ConnectionState.Closed)
                    await sqlConnection.CloseAsync();

                throw;
            }

            return entities;
        }



        [HttpGet()]
        [Route("{engineId}/{dataSourceName}/tables/{schemaName}/{tableName}/columns")]
        public async Task<ActionResult<List<YSqlColumn>>> GetAzureSqlDatabaseColumnsAsync(Guid engineId, string dataSourceName, string schemaName, string tableName)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            // Get connection string
            var cs = await keyVaultsController.GetKeyVaultSecret(engineId, dataSourceName);

            var dataSource = await this.dataFactoriesController.GetDataSourceAsync(engineId, dataSourceName);

            if (dataSource.Value == null)
                throw new Exception("Can't get datasource");

            var sqlDatabaseSource = YDataSourceFactory.GetTypedDatSource(dataSource.Value) as YDataSourceAzureSqlDatabase;

            if (sqlDatabaseSource == null)
                throw new Exception($"Data Source {dataSourceName} is not a Sql data source");

            sqlDatabaseSource.Password = cs.Value;

            using var sqlConnection = new SqlConnection(sqlDatabaseSource.ConnectionString);

            var tableCommandText = @"Select col.name as ColumnName,
                                    col.column_id as ColumnId, 
                                    typ.name as ColumnType
	                                    from sys.columns as col
	                                    Inner join sys.tables as tbl on tbl.object_id = col.object_id
	                                    Inner join sys.schemas as sch on tbl.schema_id = sch.schema_id
	                                    Inner Join sys.systypes typ on typ.xusertype = col.system_type_id
                                    Where tbl.name = @TableName and sch.name = @SchemaName;";

            var sqlCommand = new SqlCommand(tableCommandText, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@SchemaName", schemaName);
            sqlCommand.Parameters.AddWithValue("@TableName", tableName);

            var entities = new List<YSqlColumn>();

            try
            {
                await sqlConnection.OpenAsync();

                using var dr = await sqlCommand.ExecuteReaderAsync();

                while (dr.Read())
                {
                    var col = new YSqlColumn
                    {
                        ColumnName = dr["ColumnName"].ToString(),
                        Type = dr["ColumnType"].ToString(),
                        Id = dr["ColumnId"] != DBNull.Value ? (int)dr["ColumnId"] : default
                    };
                    entities.Add(col);
                }

                await sqlConnection.CloseAsync();
            }
            catch (Exception)
            {

                if (sqlConnection.State != System.Data.ConnectionState.Closed)
                    await sqlConnection.CloseAsync();

                throw;
            }

            return entities;
        }


        [HttpGet()]
        [Route("{engineId}/{dataSourceName}/tables/{schemaName}/{tableName}/preview")]
        public async Task<ActionResult<JArray>> GetAzureSqlDatabasePreviewAsync(Guid engineId, string dataSourceName, string schemaName, string tableName)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            // Get connection string
            var cs = await keyVaultsController.GetKeyVaultSecret(engineId, dataSourceName);

            var dataSource = await this.dataFactoriesController.GetDataSourceAsync(engineId, dataSourceName);

            if (dataSource.Value == null)
                throw new Exception("Can't get datasource");

            var sqlDatabaseSource = YDataSourceFactory.GetTypedDatSource(dataSource.Value) as YDataSourceAzureSqlDatabase;

            if (sqlDatabaseSource == null)
                throw new Exception($"Data Source {dataSourceName} is not a Sql data source");

            sqlDatabaseSource.Password = cs.Value;

            using var sqlConnection = new SqlConnection(sqlDatabaseSource.ConnectionString);

            var rows = new JArray();

            try
            {
                // preventing sql injection by using input as var in first instance
                var tableStructureCommandText = @"Select tbl.name as TableName, sch.name as SchemaName 
                                        From sys.tables as tbl  
                                        Inner join sys.schemas as sch on tbl.schema_id = sch.schema_id
                                        Where tbl.name=@TableName and sch.name=@SchemaName";

                var sqlStructureCommand = new SqlCommand(tableStructureCommandText, sqlConnection);

                sqlStructureCommand.Parameters.AddWithValue("@SchemaName", schemaName);
                sqlStructureCommand.Parameters.AddWithValue("@TableName", tableName);

                await sqlConnection.OpenAsync();

                using var dr = await sqlStructureCommand.ExecuteReaderAsync();

                YSqlTable ysqlTable = null;

                if (dr.Read())
                {
                    ysqlTable = new YSqlTable
                    {
                        TableName = dr["TableName"].ToString(),
                        SchemaName = dr["SchemaName"].ToString()
                    };
                }

                if (ysqlTable == null)
                    return rows;

                dr.Close();

                var tableRowsCommandText = @$"Select top 10 * from [{ysqlTable.SchemaName}].[{ysqlTable.TableName}]";

                var sqlRowsCommand = new SqlCommand(tableRowsCommandText, sqlConnection);

                using var sqlRowsReader = await sqlRowsCommand.ExecuteReaderAsync();

                while (sqlRowsReader.Read())
                {
                    var row = new JObject();

                    for (int i = 0; i < sqlRowsReader.FieldCount; i++)
                    {
                        var colName = sqlRowsReader.GetName(i);
                        var val = sqlRowsReader.GetValue(i);
                        row.Add(colName, new JValue(val));
                    }

                    rows.Add(row);
                }


                await sqlConnection.CloseAsync();
            }
            catch (Exception)
            {

                if (sqlConnection.State != System.Data.ConnectionState.Closed)
                    await sqlConnection.CloseAsync();

                throw;
            }

            return rows;
        }


    }



}