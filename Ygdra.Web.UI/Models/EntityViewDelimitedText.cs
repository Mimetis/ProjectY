using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Ygdra.Core.Entities.Entities;

namespace Ygdra.Web.UI.Models
{
    public class EntityViewDelimitedText : EntityView
    {
        private YEntityDelimitedText entity;

        public EntityViewDelimitedText() => this.entity = new YEntityDelimitedText();
        public override YEntity Entity => this.entity;
        public override bool IsNew { get; set; }
        public override Guid EngineId { get; set; }
        public override string Icon => "svg-i-100x100-DelimitedText";
        public override string PartialView => "_AzureDelimitedTextPartial";
        public override string TypeString => "Delimited Text (csv)";

        /// <summary>
        /// <summary>
        /// Gets or Sets the hidden fields to store data sources for postback
        /// </summary>
        public string DataSourcesItemsString { get; set; }

        /// Gets the select items for data sources
        /// </summary>
        public List<SelectListItem> DataSourcesItems => DataSourcesItemsString?.Split(",").OrderBy(l => l).Select(l => new SelectListItem(l, l)).ToList();


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
        public string Container { get => this.entity.Container; set => this.entity.Container= value; }

        [Display(Name = "File Name")]
        public string FileName { get => this.entity.FileName; set => this.entity.FileName = value; }

        [Display(Name = "Null Value")]
        public string NullValue { get => this.entity.NullValue; set => this.entity.NullValue = value; }

        [Display(Name = "First Row As Header")]
        public bool FirstRowAsHeader { get => this.entity.FirstRowAsHeader; set => this.entity.FirstRowAsHeader = value; }

        [Display(Name = "Compression Type")]
        public string CompressionCodec { get => this.entity.CompressionCodec; set => this.entity.CompressionCodec = value; }

        [Display(Name = "Column Delimited")]
        public string ColumnDelimiter { get => this.entity.ColumnDelimiter; set => this.entity.ColumnDelimiter = value; }

        [Display(Name = "Row Delimiter")]
        public string RowDelimiter { get => this.entity.RowDelimiter; set => this.entity.RowDelimiter = value; }

        [Display(Name = "Encoding Type")]
        public string EncodingName { get => this.entity.EncodingName; set => this.entity.EncodingName = value; }

        [Display(Name = "Escape Character")]
        public string EscapeChar { get => this.entity.EscapeChar; set => this.entity.EscapeChar = value; }

        [Display(Name = "Quote Character")]
        public string QuoteChar { get => this.entity.QuoteChar; set => this.entity.QuoteChar = value; }


        public string DirectoryPath { get; set; }

        public List<SelectListItem> EscapeCharacters =>
            new List<SelectListItem>()
            {
                new SelectListItem("Backslash (\\)", "\\"),
                new SelectListItem("Slash (/)", "/"),
                new SelectListItem("No escape character", "none")
            };

        public List<SelectListItem> QuoteCharacters =>
            new List<SelectListItem>()
            {
                new SelectListItem("Double quote ('')", "''"),
                new SelectListItem("Simple quote (')", "'"),
                new SelectListItem("No quote character", "none")
            };


        public List<SelectListItem> Encodings =>
            new List<SelectListItem>()
            {
                new SelectListItem("Default (UTF-8)", "UTF-8"),
                new SelectListItem("UTF-7", "UTF-7"),
                new SelectListItem("UTF-16", "UTF-16"),
                new SelectListItem("UTF-16BE", "UTF-16BE"),
                new SelectListItem("UTF-32", "UTF-32"),
                new SelectListItem("UTF-32BE", "UTF-32BE"),
                new SelectListItem("US-ASCII", "US-ASCII")
            };


        public List<SelectListItem> RowDelimiters =>
            new List<SelectListItem>()
            {
                new SelectListItem("Auto detect (\\r, \\n or \\r\\n)", "none"),
                new SelectListItem("Line feed (\\n)", "\\n"),
                new SelectListItem("Carriage return (\\r)", "\\r"),
                new SelectListItem("No Delimiter", "none"),
            };
        public List<SelectListItem> ColumnDelimiters =>
            new List<SelectListItem>()
            {
                new SelectListItem("none", "none"),
                new SelectListItem("Comma (,)", ","),
                new SelectListItem("Semicolon (;)", ";"),
                new SelectListItem("Pipe (|)", "|"),
                new SelectListItem("Tab (\\t)", "\\t"),
                new SelectListItem("Start of heading", "\\u0001"),
                new SelectListItem("No Delimiter", "none"),
            };

        public List<SelectListItem> CompressionCodecs =>
            new List<SelectListItem>()
            {
                new SelectListItem("none", "none"),
                new SelectListItem("bzip2", "bzip2"),
                new SelectListItem("gzip", "gzip"),
                new SelectListItem("deflate", "deflate"),
                new SelectListItem("ZipDeflate", "ZipDeflate"),
                new SelectListItem("tarGZip", "tarGZip"),
                new SelectListItem("tar", "tar"),
                new SelectListItem("snappy", "snappy"),
                new SelectListItem("lz4", "lz4"),
            };


    }

}
