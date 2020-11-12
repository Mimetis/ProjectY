using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Ygdra.Core.Entities.Entities;

namespace Ygdra.Web.UI.Models
{
    public class EntityViewDelimitedText : EntityView
    {

        public new YEntityDelimitedText Entity { get; set; }

        public EntityViewDelimitedText() : base()
        {

        }

        public EntityViewDelimitedText(EntityView entityView = null) : base(entityView)
        {
            this.Entity = new YEntityDelimitedText(entityView.Entity);
        }

        public override string Icon => "svg-i-100x100-DelimitedText";
        public override string PartialView => "_AzureDataLakeStorageDelimitedPartial";
        public override string TypeString => "Delimited Text (csv)";

        /// <summary>
        /// <summary>
        /// Gets or Sets the hidden fields to store data sources for postback
        /// </summary>
        public string DataSourcesItemsString { get; set; }

        /// Gets the select items for data sources
        /// </summary>
        public List<SelectListItem> DataSourcesItems => DataSourcesItemsString?.Split(",").OrderBy(l => l).Select(l => new SelectListItem(l, l)).ToList();

        [Required(ErrorMessage = "Directory Path is required")]
        [Display(Name = "Directory Path")]
        public string FolderPath { get => Entity.FolderPath; set => Entity.FolderPath = value; }

        [Display(Name = "File System")]
        public string FileSystem { get => Entity.FileSystem; set => Entity.FileSystem = value; }

        [Display(Name = "File Name")]
        public string FileName { get => Entity.FileName; set => Entity.FileName = value; }

        [Display(Name = "Null Value")]
        public string NullValue { get => Entity.NullValue; set => Entity.NullValue = value; }

        [Display(Name = "First Row As Header")]
        public bool FirstRowAsHeader { get => Entity.FirstRowAsHeader; set => Entity.FirstRowAsHeader = value; }

        [Display(Name = "Compression Type")]
        public string CompressionCodec { get => this.Entity.CompressionCodec; set => this.Entity.CompressionCodec = value; }

        [Display(Name = "Column Delimited")]
        public string ColumnDelimiter { get => this.Entity.ColumnDelimiter; set => this.Entity.ColumnDelimiter = value; }

        [Display(Name = "Row Delimiter")]
        public string RowDelimiter { get => this.Entity.RowDelimiter; set => this.Entity.RowDelimiter = value; }

        [Display(Name = "Encoding Type")]
        public string EncodingName { get => this.Entity.EncodingName; set => this.Entity.EncodingName = value; }

        [Display(Name = "Escape Character")]
        public string EscapeChar { get => this.Entity.EscapeChar; set => this.Entity.EscapeChar = value; }

        [Display(Name = "Quote Character")]
        public string QuoteChar { get => this.Entity.QuoteChar; set => this.Entity.QuoteChar = value; }


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
