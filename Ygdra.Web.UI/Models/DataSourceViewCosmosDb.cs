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

        public DataSourceViewCosmosDb()
        {
            this.IsNew = true;
            this.dataSource = new YDataSourceCosmosDb();
        }

        public DataSourceViewCosmosDb(YDataSource dataSource)
        {
            this.IsNew = false;
            this.dataSource = new YDataSourceCosmosDb(dataSource);
        }

        public override string PartialView => "_AzureCosmosDBPartial";

        public override string Icon => "svg-i-100x100-AzureCosmosDB";

        public override string TypeString => "Azure Cosmos DB";


        [Display(Name = "Connection Url")]
        [Required(ErrorMessage = "Connection Url is required")]
        public string ConnectionUrl { get => ((YDataSourceCosmosDb)this.dataSource).AccountEndpoint; set => ((YDataSourceCosmosDb)this.dataSource).AccountEndpoint = value; }

        [Display(Name = "Storage Account Key")]
        [Required(ErrorMessage = "Storage Account Key is required")]
        public string StorageAccountKey { get => ((YDataSourceCosmosDb)this.dataSource).AccountKey; set => ((YDataSourceCosmosDb)this.dataSource).AccountKey = value; }

        [Display(Name = "Database name")]
        [Required(ErrorMessage = "Database Name is required")]
        public string DatabaseName { get => ((YDataSourceCosmosDb)this.dataSource).DatabaseName; set => ((YDataSourceCosmosDb)this.dataSource).DatabaseName = value; }

        
    }

}
