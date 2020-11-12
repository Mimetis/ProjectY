using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Ygdra.Core.DataSources.Entities;

namespace Ygdra.Web.UI.Models
{
    public class DataSourceViewCosmosDb : DataSourceView
    {

        public DataSourceViewCosmosDb() : base()
        {

        }
        public DataSourceViewCosmosDb(DataSourceView dataSourceView = null) : base(dataSourceView)
        {
            this.DataSource = new YDataSourceCosmosDb(dataSourceView.DataSource);
        }

        public new YDataSourceCosmosDb DataSource { get; set; }

        public override string PartialView => "_AzureCosmosDBPartial";

        public override string Icon => "svg-i-100x100-AzureCosmosDB";

        public override string TypeString => "Azure Cosmos DB";


        [Display(Name = "Connection Url")]
        [Required(ErrorMessage = "Connection Url is required")]
        public string ConnectionUrl { get => this.DataSource.AccountEndpoint; set => this.DataSource.AccountEndpoint = value; }

        [Display(Name = "Storage Account Key")]
        [Required(ErrorMessage = "Storage Account Key is required")]
        public string StorageAccountKey { get => this.DataSource.AccountKey; set => this.DataSource.AccountKey = value; }

        [Display(Name = "Database name")]
        [Required(ErrorMessage = "Database Name is required")]
        public string DatabaseName { get => this.DataSource.DatabaseName; set => this.DataSource.DatabaseName = value; }

        
    }

}
