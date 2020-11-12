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
        public DataSourceViewAzureDatabricks() : base()
        {

        }
        public DataSourceViewAzureDatabricks(DataSourceView dataSourceView = null) : base(dataSourceView)
        {
            this.DataSource = new YDataSourceAzureDatabricks(dataSourceView.DataSource);
        }

        public new YDataSourceAzureDatabricks DataSource { get; set; }

        public override string PartialView => "_AzureDatabricksPartial";
        public override string Icon => "svg-i-100x100-DataBricks";
        public override string TypeString => "Azure DataBricks";


        [Display(Name = "Workspace Url")]
        [Required(ErrorMessage = "Workspace Url is required")]
        public string WorkspaceUrl { get => this.DataSource.WorkspaceUrl; set => this.DataSource.WorkspaceUrl = value; }

        [Display(Name = "Access Token")]
        [Required(ErrorMessage = "Access Token is required")]
        public string AccessToken { get => this.DataSource.AccessToken; set => this.DataSource.AccessToken = value; }

        [Display(Name = "Existing Cluster Id")]
        [Required(ErrorMessage = "Cluster Id is required")]
        public string ExistingClusterId { get => this.DataSource.ExistingClusterId; set => this.DataSource.ExistingClusterId = value; }

    }

}
