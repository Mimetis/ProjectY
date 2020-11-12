﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
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
    public class EntityView
    {
        public EntityView(YEntity entity)
        {
            this.IsNew = false;
            this.Entity = entity;
        }
        public EntityView()
        {
            this.IsNew = true;
            this.Entity = new YEntity();

        }

        [JsonIgnore]
        public bool IsNew { get; set; }

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

        [Required(ErrorMessage = "You should select an engine")]
        public Guid EngineId { get; set; }

        public string Type
        {
            get => this.Entity.Type;
            set => this.Entity.Type = value;
        }

        [Required(ErrorMessage = "You should select an entity source type")]
        public YEntityType EntityType
        {
            get => this.Entity.EntityType;
            set => this.Entity.EntityType = value;
        }

        public virtual string PartialView { get; }
        public virtual string Icon => "svg-i-100x100-HTTP";
        public virtual string TypeString => "Azure DataSet";
        public virtual YEntity Entity { get; set; }
    }

    /// <summary>
    /// Used to store unknown entities coming from ADF
    /// </summary>
    public class EntityViewUnknown : EntityView
    {
    }



    public class EntityViewFactory
    {
        public static EntityView GetTypedEntityVieweView(YEntity entity)
        {
            switch (entity.EntityType)
            {
                case YEntityType.AzureSqlTable:
                    return new EntityViewAzureSqlTable(entity);
                case YEntityType.DelimitedText:
                    return new EntityViewDelimitedText(entity);
                case YEntityType.None:
                default:
                    return new EntityView(entity);
            }
        }
    }
}