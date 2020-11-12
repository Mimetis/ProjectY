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

        private YDataSourceAzureDatabricks dataSource;
        public DataSourceViewAzureDatabricks()
        {
            this.dataSource = new YDataSourceAzureDatabricks() { DataSourceType = YDataSourceType.AzureDatabricks };
        }

        public override YDataSource DataSource { get => this.dataSource; }
        public override bool IsNew { get; set; }
        public override Guid EngineId { get; set; }


        public override string PartialView => "_AzureDatabricksPartial";
        public override string Icon => "svg-i-100x100-DataBricks";
        public override string TypeString => "Azure DataBricks";
        public override YDataSourceType DataSourceType => this.dataSource.DataSourceType;


        [Display(Name = "Workspace Url")]
        [Required(ErrorMessage = "Workspace Url is required")]
        public string WorkspaceUrl { get => this.dataSource.WorkspaceUrl; set => this.dataSource.WorkspaceUrl = value; }

        [Display(Name = "Access Token")]
        [Required(ErrorMessage = "Access Token is required")]
        public string AccessToken { get => this.dataSource.AccessToken; set => this.dataSource.AccessToken = value; }

        [Display(Name = "Existing Cluster Id")]
        [Required(ErrorMessage = "Cluster Id is required")]
        public string ExistingClusterId { get => this.dataSource.ExistingClusterId; set => this.dataSource.ExistingClusterId = value; }

    }

}
