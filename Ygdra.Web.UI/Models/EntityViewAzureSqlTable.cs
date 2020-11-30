using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Ygdra.Core.Entities.Entities;

namespace Ygdra.Web.UI.Models
{
    public class EntityViewAzureSqlTable : EntityView
    {
        private YEntityAzureSqlTable entity;

        public EntityViewAzureSqlTable()
        {
            this.entity = new YEntityAzureSqlTable();
            this.Mode = "Full";
        }
        public override YEntity Entity => this.entity;
        public override bool IsNew { get; set; }
        public override Guid EngineId { get; set; }
        public override string Icon => "svg-i-100x100-AzureSQLDatabase";
        public override string PartialView => "_AzureSqlDatabaseTablesPartial";
        public override string TypeString => "Azure SQL Table";

        public string Schema { get => this.entity.Schema; set => this.entity.Schema = value; }
        public string Table { get => this.entity.Table; set => this.entity.Table = value; }


        /// <summary>
        /// Gets or Sets the hidden fields to store tables for postback
        /// </summary>
        public string TablesItemsString { get; set; }

        /// <summary>
        /// Gets or Sets the hidden fields to store data sources for postback
        /// </summary>
        public string DataSourcesItemsString { get; set; }

        /// <summary>
        /// Gets the select items for data sources
        /// </summary>
        public List<SelectListItem> DataSourcesItems => DataSourcesItemsString?.Split(",").OrderBy(l => l).Select(l => new SelectListItem(l, l)).ToList();

        /// <summary>
        /// Gets the select items for tables
        /// </summary>
        public List<SelectListItem> TablesItems => TablesItemsString?.Split(",").OrderBy(l => l).Select(l => new SelectListItem(l, l)).ToList();

        [Required(ErrorMessage = "You need to select a table")]
        public string TableName
        {
            get
            {

                if (string.IsNullOrEmpty(Schema))
                    return null;

                string table = Table;
                if (!string.IsNullOrEmpty(Schema))
                    table = $"{Schema}.{Table}";

                return table;
            }
            set
            {
                if (string.IsNullOrEmpty(value))
                {
                    Schema = null;
                    Table = null;
                    return;
                }

                var table = value.Split(new char[] { '.' });

                if (table.Length == 2)
                {
                    Schema = table[0];
                    Table = table[1];
                }
                else
                {
                    Table = table[0];
                }
            }
        }


    }
}
