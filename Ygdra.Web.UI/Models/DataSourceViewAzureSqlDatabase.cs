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
        private YDataSourceAzureSql dataSource;

        public DataSourceViewAzureSqlDatabase() 
        {
            this.dataSource = new YDataSourceAzureSqlDatabase();
        }

        public override YDataSource DataSource { get => this.dataSource;}
        public override bool IsNew { get; set; }
        public override Guid EngineId { get; set; }

        public override string PartialView => "_AzureSqlDatabasePartial";
        public override string Icon => "svg-i-100x100-AzureSQLDatabase";
        public override string TypeString => "Azure SQL Database";
        public override YDataSourceType DataSourceType => this.dataSource.DataSourceType;


        [Display(Name = "Data Source")]
        [Required(ErrorMessage = "Data Source is required.")]
        public string DbDataSource { get => this.dataSource.DataSource; set => this.dataSource.DataSource = value; }

        [Display(Name = "Database Name")]
        [Required(ErrorMessage = "Database Name is required.")]
        public string InitialCatalog { get => this.dataSource.InitialCatalog; set => this.dataSource.InitialCatalog = value; }

        [Display(Name = "User Id")]
        [Required(ErrorMessage = "User Id is required.")]
        public string UserId { get => this.dataSource.UserId; set => this.dataSource.UserId = value; }

        [Display(Name = "Password")]
        [Required(ErrorMessage = "Password is required.")]
        public string Password { get => this.dataSource.Password; set => this.dataSource.Password = value; }

    }

}
