using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Ygdra.Core.DataSources.Entities;
using Ygdra.Core.Entities.Entities;
using Ygdra.Core.Http;
using Ygdra.Web.UI.Controllers;

namespace Ygdra.Web.UI.Models
{
    public abstract class EntityView
    {
        public abstract YEntity Entity { get; }

        public abstract bool IsNew { get; set; }
        public abstract Guid EngineId { get; set; }
        public abstract string PartialView { get; }
        public abstract string Icon { get; }
        public abstract string TypeString { get; }
        public YEntityType EntityType
        {
            get
            {
                return this.Entity.EntityType;
            }
            set
            {
                this.Entity.EntityType = value;
            }
        }

        [Required]
        [StringLength(20, MinimumLength = 5)]
        [Display(Name = "Entity name")]
        public string Name
        {
            get => this.Entity.Name;
            set => this.Entity.Name = value;
        }

        [Required(ErrorMessage = "You should select a data source")]
        public string DataSourceName
        {
            get => this.Entity.DataSourceName;
            set => this.Entity.DataSourceName = value;
        }

        public string Version
        {
            get => this.Entity.Version;
            set => this.Entity.Version = value;
        }


        public string Type
        {
            get => this.Entity.Type;
            set => this.Entity.Type = value;
        }

    }

    /// <summary>
    /// Used to store unknown entities coming from ADF
    /// </summary>
    public class EntityViewUnknown : EntityView
    {
        private readonly YEntity entity;

        public EntityViewUnknown() => this.entity = new YEntityUnknown() { EntityType = YEntityType.None };

        public EntityViewUnknown(YEntity entity) => this.entity = entity;

        public override YEntity Entity => this.entity;

        public override bool IsNew { get; set; }
        public override Guid EngineId { get; set; }

        public override string PartialView => null;

        public override string Icon => "svg-i-100x100-HTTP";

        public override string TypeString => "Azure DataSet";

    }



    public class EntityViewFactory
    {
        public static EntityView GetTypedEntityView(YEntityType entityType, EntityView entityView = null)
        {
            EntityView ev = entityType switch
            {
                YEntityType.AzureSqlTable => new EntityViewAzureSqlTable(),
                YEntityType.DelimitedText => new EntityViewDelimitedText(),
                YEntityType.Parquet => new EntityViewParquet(),
                _ => new EntityViewUnknown(),
            };

            if (entityView != null)
            {
                ev.Entity.Name = entityView.Entity.Name;
                ev.Entity.AdditionalData = entityView.Entity.AdditionalData;
                ev.Entity.DataSourceName = entityView.Entity.DataSourceName;
                ev.Entity.EntityType = entityView.Entity.EntityType;
                ev.Entity.Type = entityView.Entity.Type;
                ev.Entity.Version = entityView.Entity.Version;

                ev.EngineId = entityView.EngineId;
                ev.IsNew = entityView.IsNew;

                if (ev.Entity.AdditionalData?["properties"] is JObject props)
                    ev.Entity.OnDeserialized(props);
            }

            return ev;
        }
    }
    public static class EntityViewFactoryExtensions
    {
        public static EntityView ToTypedEntityView(this EntityView entityView, YEntityType entityType) => EntityViewFactory.GetTypedEntityView(entityType, entityView);
        public static EntityView ToTypedEntityView(this YEntity entity) => EntityViewFactory.GetTypedEntityView(entity.EntityType, new EntityViewUnknown(entity));
    }
}
