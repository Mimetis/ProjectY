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
        public DataSourceViewAzureSqlDatabase() : base()
        {
            this.DataSource = new YDataSourceAzureSqlDatabase(base.DataSource);
        }
        public DataSourceViewAzureSqlDatabase(YDataSourceType dataSourceType) : base()
        {
            this.DataSource = new YDataSourceAzureSqlDatabase(dataSourceType);
        }

        public DataSourceViewAzureSqlDatabase(DataSourceView dataSourceView = null) : base(dataSourceView)
        {
            this.DataSource = new YDataSourceAzureSqlDatabase(dataSourceView.DataSource);
        }

        public new YDataSourceAzureSqlDatabase DataSource { get; set; }


        public override string PartialView => "_AzureSqlDatabasePartial";
        public override string Icon => "svg-i-100x100-AzureSQLDatabase";
        public override string TypeString => "Azure SQL Database";


        [Display(Name = "Data Source")]
        [Required(ErrorMessage = "Data Source is required.")]
        public string DbDataSource { get => this.DataSource.DataSource; set => this.DataSource.DataSource = value; }

        [Display(Name = "Database Name")]
        [Required(ErrorMessage = "Database Name is required.")]
        public string InitialCatalog { get => this.DataSource.InitialCatalog; set => this.DataSource.InitialCatalog = value; }

        [Display(Name = "User Id")]
        [Required(ErrorMessage = "User Id is required.")]
        public string UserId { get => this.DataSource.UserId; set => this.DataSource.UserId = value; }

        [Display(Name = "Password")]
        [Required(ErrorMessage = "Password is required.")]
        public string Password { get => this.DataSource.Password; set => this.DataSource.Password = value; }


    }

}
