using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Ygdra.Core.DataSources.Entities;

namespace Ygdra.Web.UI.Models
{
    public class DataSourceViewAzureBlobStorage : DataSourceView
    {

        private readonly YDataSourceAzureBlobStorage dataSource;

        public DataSourceViewAzureBlobStorage()
        {
            this.dataSource = new YDataSourceAzureBlobStorage();
        }

        public override YDataSource DataSource { get => this.dataSource; }
        public override bool IsNew { get; set; }
        public override Guid EngineId { get; set; }
        public override string PartialView => "_AzureBlobStorage";
        public override string Icon => "svg-i-100x100-AzureBlob";
        public override string TypeString => "Azure Blob Storage";
        public override YDataSourceType DataSourceType => this.dataSource.DataSourceType;



        [Display(Name = "Account Name")]
        [Required(ErrorMessage = "Account Name is required")]
        public string StorageAccountName { get => this.dataSource.StorageAccountName; set => this.dataSource.StorageAccountName = value; }

        [Display(Name = "Account Key")]
        [Required(ErrorMessage = "Account Key is required")]
        public string StorageAccountKey { get => this.dataSource.StorageAccountKey; set => this.dataSource.StorageAccountKey = value; }

    }

}
