using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Ygdra.Core.DataSources.Entities;

namespace Ygdra.Web.UI.Models
{
    public class DataSourceViewAzureSqlDatabase : DataSourceView
    {

        public DataSourceViewAzureSqlDatabase()
        {
            this.dataSource = new YDataSourceAzureSqlDatabase();
        }

        public DataSourceViewAzureSqlDatabase(YDataSourceType dataSourceType)
        {
            this.IsNew = true;
            this.dataSource = new YDataSourceAzureSqlDatabase(dataSourceType);
        }

        public DataSourceViewAzureSqlDatabase(YDataSource dataSource)
        {
            this.IsNew = false;
            this.dataSource = new YDataSourceAzureSqlDatabase(dataSource);
        }


        public override string PartialView => "_AzureSqlDatabasePartial";
        public override string Icon => "svg-i-100x100-AzureSQLDatabase";
        public override string TypeString => "Azure SQL Database";


        [Display(Name = "Data Source")]
        [Required(ErrorMessage = "Data Source is required.")]
        public string DataSource { get => ((YDataSourceAzureSqlDatabase)this.dataSource).DataSource; set => ((YDataSourceAzureSqlDatabase)this.dataSource).DataSource = value; }

        [Display(Name = "Database Name")]
        [Required(ErrorMessage = "Database Name is required.")]
        public string InitialCatalog { get => ((YDataSourceAzureSqlDatabase)this.dataSource).InitialCatalog; set => ((YDataSourceAzureSqlDatabase)this.dataSource).InitialCatalog = value; }

        [Display(Name = "User Id")]
        [Required(ErrorMessage = "User Id is required.")]
        public string UserId { get => ((YDataSourceAzureSqlDatabase)this.dataSource).UserId; set => ((YDataSourceAzureSqlDatabase)this.dataSource).UserId = value; }

        [Display(Name = "Password")]
        [Required(ErrorMessage = "Password is required.")]
        public string Password { get => ((YDataSourceAzureSqlDatabase)this.dataSource).Password; set => ((YDataSourceAzureSqlDatabase)this.dataSource).Password = value; }


    }

}
