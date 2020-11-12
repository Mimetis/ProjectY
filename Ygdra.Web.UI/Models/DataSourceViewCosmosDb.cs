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

        private YDataSourceCosmosDb dataSource;

        public DataSourceViewCosmosDb()
        {
            this.dataSource = new YDataSourceCosmosDb() { DataSourceType = YDataSourceType.CosmosDb };
        }

        public override YDataSource DataSource { get => this.dataSource; }
        public override bool IsNew { get; set; }
        public override Guid EngineId { get; set; }
        public override string PartialView => "_AzureCosmosDBPartial";
        public override string Icon => "svg-i-100x100-AzureCosmosDB";
        public override string TypeString => "Azure Cosmos DB";
        public override YDataSourceType DataSourceType => this.dataSource.DataSourceType;

        [Display(Name = "Connection Url")]
        [Required(ErrorMessage = "Connection Url is required")]
        public string ConnectionUrl { get => this.dataSource.AccountEndpoint; set => this.dataSource.AccountEndpoint = value; }

        [Display(Name = "Storage Account Key")]
        [Required(ErrorMessage = "Storage Account Key is required")]
        public string StorageAccountKey { get => this.dataSource.AccountKey; set => this.dataSource.AccountKey = value; }

        [Display(Name = "Database name")]
        [Required(ErrorMessage = "Database Name is required")]
        public string DatabaseName { get => this.dataSource.DatabaseName; set => this.dataSource.DatabaseName = value; }

    }

}
