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
    public abstract class DataSourceView
    {
        public abstract YDataSource DataSource { get; }

        public abstract bool IsNew { get; set; }
        public abstract Guid EngineId { get; set; }

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


        public abstract YDataSourceType DataSourceType { get; }
        public abstract string PartialView { get; }
        public abstract string Icon { get; }
        public abstract string TypeString { get; }

    }


    public class DataSourceViewUnknown : DataSourceView
    {
        private YDataSource dataSource;

        public DataSourceViewUnknown() => this.dataSource = new YDataSource();

        public DataSourceViewUnknown(YDataSource dataSource) => this.dataSource = dataSource;

        public override YDataSource DataSource { get => this.dataSource; }
        public override bool IsNew { get; set; }
        public override Guid EngineId { get; set; }
        public override YDataSourceType DataSourceType => this.dataSource.DataSourceType;
        public override string PartialView => null;
        public override string Icon => "svg-i-100x100-HTTP";
        public override string TypeString => "svg-i-100x100-HTTP";
    }

    public class DataSourceViewFactory
    {
        public static DataSourceView GetTypedDatSourceView(YDataSourceType dataSourceType, DataSourceView dataSourceView = null)
        {
            DataSourceView ds;

            switch (dataSourceType)
            {
                case YDataSourceType.AzureBlobStorage:
                case YDataSourceType.AzureBlobFS:
                    ds = new DataSourceViewAzureBlobFS();
                    break;
                case YDataSourceType.AzureSqlDatabase:
                case YDataSourceType.AzureSqlDW:
                    ds = new DataSourceViewAzureSqlDatabase();
                    break;
                case YDataSourceType.AzureDatabricks:
                    ds = new DataSourceViewAzureDatabricks();
                    break;
                case YDataSourceType.CosmosDb:
                    ds = new DataSourceViewCosmosDb();
                    break;
                case YDataSourceType.None:
                default:
                    ds = new DataSourceViewUnknown();
                    break;

            }

            // clone 
            if (dataSourceView != null)
            {
                ds.DataSource.AdditionalData = dataSourceView.DataSource.AdditionalData;
                ds.DataSource.Description = dataSourceView.DataSource.Description;
                ds.DataSource.Name = dataSourceView.DataSource.Name;
                ds.DataSource.Type = dataSourceView.DataSource.Type;
                ds.EngineId = dataSourceView.EngineId;
                ds.IsNew = dataSourceView.IsNew;
                ds.Name = dataSourceView.Name;
                ds.Type = dataSourceView.Type;

                if (ds.DataSource.AdditionalData?["properties"] is JObject props)
                    ds.DataSource.OnDeserialized(props);

            }
            return ds;

        }
    }

}
