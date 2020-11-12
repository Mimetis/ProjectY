using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Ygdra.Core.DataSources.Entities;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Exceptions;
using Ygdra.Core.Http;
using Ygdra.Core.Payloads;
using Ygdra.Core.Services;

namespace Ygdra.Web.UI.Models
{
    public class DataSourceView
    {
        public YDataSource DataSource { get; set; }

        public DataSourceView()
        {
            this.DataSource = new YDataSource();
        }

        public DataSourceView(YDataSource dataSource = null)
        {
            this.DataSource = dataSource == null ? new YDataSource() : dataSource;
        }

        public DataSourceView(DataSourceView other)
        {

            this.DataSource = other.DataSource;
            this.IsNew = other.IsNew;
            this.EngineId = other.EngineId;

        }

        public bool IsNew { get; set; }
        public Guid EngineId { get; set; }

        [Required]
        [StringLength(255, MinimumLength = 5)]
        [Display(Name = "Data source name")]
        public string Name
        {
            get => this.DataSource.Name;
            set => this.DataSource.Name = value;
        }

        public string ReadOnly => this.IsNew ? "" : "readonly";

        public string JsonString => JsonConvert.SerializeObject(this.DataSource);

        public string Type
        {
            get => this.DataSource.Type;
            set => this.DataSource.Type = value;
        }


        [Required(ErrorMessage = "You should select a data source type")]
        public YDataSourceType DataSourceType
        {
            get => this.DataSource.DataSourceType;
            set => this.DataSource.DataSourceType = value;
        }

        public virtual string PartialView { get; }
        public virtual string Icon => "svg-i-100x100-HTTP";
        public virtual string TypeString => "Azure Data Source";

    }


    public class DataSourceViewUnknown : DataSourceView
    {

    }

    public class DataSourceViewFactory
    {
        public static DataSourceView GetTypedDatSourceView(DataSourceView dataSourceView)
        {
            switch (dataSourceView.DataSourceType)
            {
                case YDataSourceType.AzureBlobStorage:
                case YDataSourceType.AzureBlobFS:
                    return new DataSourceViewAzureBlobFS(dataSourceView);
                case YDataSourceType.AzureSqlDatabase:
                case YDataSourceType.AzureSqlDW:
                    return new DataSourceViewAzureSqlDatabase(dataSourceView);
                case YDataSourceType.AzureDatabricks:
                    return new DataSourceViewAzureDatabricks(dataSourceView);
                case YDataSourceType.CosmosDb:
                    return new DataSourceViewCosmosDb(dataSourceView);
                case YDataSourceType.None:
                default:
                    return new DataSourceView(dataSourceView);

            }
        }
    }

}
