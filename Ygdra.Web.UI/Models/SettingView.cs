using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Ygdra.Core.Settings.Entities;

namespace Ygdra.Web.UI.Models
{
    public class SettingView
    {

        /// <summary>
        /// Gets the authorized location
        /// </summary>
        public List<SelectListItem> SettingTypeItems => Enum.GetNames(typeof(YSettingType)).Select(l => new SelectListItem(l, l)).ToList();


        public YSetting Setting { get; set; }

        public SettingView()
        {
            this.IsNew = true;
            this.Setting = new YSetting
            {
                Id = Guid.NewGuid(),
                SettingType = YSettingType.Text
            };
        }
        public SettingView(YSetting setting)
        {
            this.IsNew = false;
            this.Setting = setting;
        }

        public bool IsNew { get; set; }

        public Guid Id
        {
            get => this.Setting.Id;
            set => this.Setting.Id = value;
        }


        public YSettingType SettingType
        {
            get => this.Setting.SettingType;
            set => this.Setting.SettingType = value;
        }


        public string SettingTypeString => this.Setting.SettingType.ToString();


        [Required]
        [Display(Name = "Name")]
        public string Name
        {
            get => this.Setting.Name;
            set => this.Setting.Name = value;
        }

        [Display(Name = "Value")]
        public string Value
        {
            get => this.Setting.Value;
            set => this.Setting.Value = value;
        }

        public DateTime? UpdateDate
        {
            get => this.Setting.UpdateDate;
            set => this.Setting.UpdateDate = value;
        }

        public string UpdateDateString => !UpdateDate.HasValue || UpdateDate == DateTime.MinValue ? "" : UpdateDate.Value.ToShortDateString();

        public string DetailsPage => $"/Settings/Edit/{this.Id}";


    }
}
