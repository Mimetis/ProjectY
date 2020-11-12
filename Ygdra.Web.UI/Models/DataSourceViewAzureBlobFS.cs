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

        public DataSourceViewAzureBlobFS()
        {
            this.IsNew = true;
            this.dataSource = new YDataSourceAzureBlobFS();
        }
        public DataSourceViewAzureBlobFS(YDataSource dataSource)
        {
            this.IsNew = false;
            this.dataSource = new YDataSourceAzureBlobFS(dataSource);
        }

        public override string PartialView => "_AzureDataLakeGen2";

        public override string Icon => "svg-i-100x100-AzureBlob";

        public override string TypeString => "Azure Data Lake Storage Gen2";

        [Display(Name = "Account Name")]
        [Required(ErrorMessage = "Account Name is required")]
        public string StorageAccountName { get => ((YDataSourceAzureBlobFS)this.dataSource).StorageAccountName; set => ((YDataSourceAzureBlobFS)this.dataSource).StorageAccountName = value; }

        [Display(Name = "Account Key")]
        [Required(ErrorMessage = "Account Key is required")]
        public string StorageAccountKey { get => ((YDataSourceAzureBlobFS)this.dataSource).StorageAccountKey; set => ((YDataSourceAzureBlobFS)this.dataSource).StorageAccountKey = value; }

    }

}
