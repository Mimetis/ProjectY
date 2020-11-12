using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Ygdra.Core.DataSources.Entities;

namespace Ygdra.Web.UI.Models
{
    public class DataSourceViewAzureDatabricks : DataSourceView
    {

        public DataSourceViewAzureDatabricks()
        {
            this.IsNew = true;
            this.dataSource = new YDataSourceAzureDatabricks();
        }

        public DataSourceViewAzureDatabricks(YDataSource dataSource)
        {
            this.IsNew = false;
            this.dataSource = new YDataSourceAzureDatabricks(dataSource);
        }

        public override string PartialView => "_AzureDatabricksPartial";
        public override string Icon => "svg-i-100x100-DataBricks";
        public override string TypeString => "Azure DataBricks";


        [Display(Name = "Workspace Url")]
        [Required(ErrorMessage = "Workspace Url is required")]
        public string WorkspaceUrl { get => ((YDataSourceAzureDatabricks)this.dataSource).WorkspaceUrl; set => ((YDataSourceAzureDatabricks)this.dataSource).WorkspaceUrl = value; }

        [Display(Name = "Access Token")]
        [Required(ErrorMessage = "Access Token is required")]
        public string AccessToken { get => ((YDataSourceAzureDatabricks)this.dataSource).AccessToken; set => ((YDataSourceAzureDatabricks)this.dataSource).AccessToken = value; }

        [Display(Name = "Existing Cluster Id")]
        [Required(ErrorMessage = "Cluster Id is required")]
        public string ExistingClusterId { get => ((YDataSourceAzureDatabricks)this.dataSource).ExistingClusterId; set => ((YDataSourceAzureDatabricks)this.dataSource).ExistingClusterId = value; }

    }

}
