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
        internal YDataSource dataSource;
        public DataSourceView()
        {
            this.IsNew = true;
            this.dataSource = new YDataSource();
        }

        public DataSourceView(YDataSource dataSource)
        {
            this.IsNew = false;
            this.dataSource = dataSource;
        }

        [JsonIgnore]
        public bool IsNew { get; set; }

        [Required]
        [StringLength(255, MinimumLength = 5)]
        [Display(Name = "Data source name")]
        public string Name
        {
            get => this.dataSource.Name;
            set => this.dataSource.Name = value;
        }


        [Required(ErrorMessage = "You should select an engine")]
        public Guid EngineId
        {
            get;
            set;
        }

        public string ReadOnly => this.IsNew ? "" : "readonly";


        public string JsonString => JsonConvert.SerializeObject(this.dataSource);

        public string Type
        {
            get => this.dataSource.Type;
            set => this.dataSource.Type = value;
        }


        [Required(ErrorMessage = "You should select a data source type")]
        public YDataSourceType DataSourceType
        {
            get => this.dataSource.DataSourceType;
            set => this.dataSource.DataSourceType = value;
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
        public static DataSourceView GetTypedDatSourceView(YDataSource dataSource)
        {
            switch (dataSource.DataSourceType)
            {
                case YDataSourceType.AzureBlobStorage:
                case YDataSourceType.AzureBlobFS:
                    return new DataSourceViewAzureBlobFS(dataSource);
                case YDataSourceType.AzureSqlDatabase:
                case YDataSourceType.AzureSqlDW:
                    return new DataSourceViewAzureSqlDatabase(dataSource);
                case YDataSourceType.AzureDatabricks:
                    return new DataSourceViewAzureDatabricks(dataSource);
                case YDataSourceType.CosmosDb:
                    return new DataSourceViewCosmosDb(dataSource);
                case YDataSourceType.None:
                default:
                    return new DataSourceView(dataSource);

            }
        }
    }

}
