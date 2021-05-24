using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Ygdra.Core.Entities.Entities;

namespace Ygdra.Web.UI.Models
{
    public class EntityViewParquet : EntityView
    {
        private YEntityParquet entity;

        public EntityViewParquet() => this.entity = new YEntityParquet();
        public override YEntity Entity => this.entity;
        public override bool IsNew { get; set; }
        public override Guid EngineId { get; set; }
        public override string Icon => "svg-i-100x100-Parquet";
        public override string PartialView => "_AzureParquetPartial";
        public override string TypeString => "Parquet";

        /// <summary>
        /// <summary>
        /// Gets or Sets the hidden fields to store data sources for postback
        /// </summary>
        public string DataSourcesItemsString { get; set; }
        public string DataSourcesJsonItemsString { get; set; }

        /// Gets the select items for data sources
        /// </summary>
        public List<SelectListItem> DataSourcesItems
        {
            get
            {
                if (string.IsNullOrEmpty(DataSourcesItemsString))
                    return null;

                var lstSelectedItems = DataSourcesItemsString.Split(",").OrderBy(l => l).Select(l => new SelectListItem(l, l)).ToList();
                return lstSelectedItems;
            }
        }


        public YEntityLocationType LocationType { get => this.entity.LocationType; set => this.entity.LocationType = value; }



        [Display(Name = "File or Directory Path")]
        public string FullPath
        {
            get
            {
                var path = Path.Join(new[] { this.Container, this.FolderPath, this.FileName });
                return path;
            }
            set
            {
                var fileSystem = value.Split("/")[0];
                var fileName = new FileInfo(value).Name;

                this.Container = fileSystem;
                this.FileName = fileName;
                this.FolderPath = value.Replace(fileSystem, "").Replace(fileName, "");

            }
        }


        [Display(Name = "Folder Path")]
        public string FolderPath { get => this.entity.FolderPath; set => this.entity.FolderPath = value; }

        [Display(Name = "Container")]
        public string Container { get => this.entity.Container; set => this.entity.Container = value; }

        [Display(Name = "File Name")]
        public string FileName { get => this.entity.FileName; set => this.entity.FileName = value; }

        [Display(Name = "Compression Type")]
        public string CompressionCodec { get => this.entity.CompressionCodec; set => this.entity.CompressionCodec = value; }

        public string DirectoryPath { get; set; }

 
        public List<SelectListItem> CompressionCodecs =>
            new List<SelectListItem>()
            {
                new SelectListItem("none", "none"),
                new SelectListItem("gzip", "gzip"),
                new SelectListItem("snappy", "snappy"),
                new SelectListItem("lzo", "lzo"),
            };


    }

}
