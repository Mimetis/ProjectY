using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Ygdra.Core.DataSources.Entities;

namespace Ygdra.Web.UI.Models
{
    public class DataSourceViewAzureBlobFS : DataSourceView
    {
        public DataSourceViewAzureBlobFS() : base()
        {

        }

        public DataSourceViewAzureBlobFS(DataSourceView dataSourceView) : base(dataSourceView)
        {
            this.DataSource = new YDataSourceAzureBlobFS(dataSourceView.DataSource);
        }

        public new YDataSourceAzureBlobFS DataSource { get; set; }


        public override string PartialView => "_AzureDataLakeGen2";

        public override string Icon => "svg-i-100x100-AzureBlob";

        public override string TypeString => "Azure Data Lake Storage Gen2";

        [Display(Name = "Account Name")]
        [Required(ErrorMessage = "Account Name is required")]
        public string StorageAccountName { get => this.DataSource.StorageAccountName; set => this.DataSource.StorageAccountName = value; }

        [Display(Name = "Account Key")]
        [Required(ErrorMessage = "Account Key is required")]
        public string StorageAccountKey { get => this.DataSource.StorageAccountKey; set => this.DataSource.StorageAccountKey = value; }

    }

}
