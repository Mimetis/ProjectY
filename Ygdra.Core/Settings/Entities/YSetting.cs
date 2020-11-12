using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Ygdra.Core.Settings.Entities
{
    public class YSetting
    {
        [Key]
        [JsonProperty("id")]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public DateTime? UpdateDate { get; set; }
        public YSettingType SettingType { get; set; }

        public string Type => YType.Setting.ToString();
    }
}
