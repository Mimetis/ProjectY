using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Ygdra.Core.Settings.Entities
{
    public class YDatabricksClusterNodeTypeSettingTypes
    {
        public YDatabricksClusterNodeTypeSettingTypes()
        {
            var test = new List<(string GroupName, string Key, string Value)>
            {
                ("GroupName", "Key", "Value")
            };
        }

        public static List<(string GroupName, string Key, string Value)> Values => new List<(string GroupName, string Key, string Value)>
        {
            ("General Purpose", "Standard_DS3_v2", "Standard_DS3_v2" ),
            ("General Purpose", "Standard_DS4_v2", "Standard_DS4_v2" ),
            ("General Purpose", "Standard_DS5_v2", "Standard_DS5_v2" ),
            ("General Purpose (HDD)", "Standard_D3_v2", "Standard_D3_v2" ),
            ("General Purpose (HDD)", "Standard_D8_v3", "Standard_D8_v3" ),
            ("General Purpose (HDD)", "Standard_D16_v3", "Standard_D16_v3" ),
            ("Memory Optimized (Remote HDD)", "Standard_D12_v2", "Standard_D12_v2" ),
            ("Memory Optimized (Remote HDD)", "Standard_D13_v2", "Standard_D13_v2" ),
            ("Memory Optimized (Remote HDD)", "Standard_D14_v2", "Standard_DS14_v2" ),
            ("Memory Optimized (Remote HDD)", "Standard_D15_v2", "Standard_DS15_v2" ),
            ("Memory Optimized", "Standard_DS12_v2", "Standard_DS12_v2" ),
            ("Memory Optimized", "Standard_DS13_v2", "Standard_DS13_v2" ),
            ("Memory Optimized", "Standard_DS14_v2", "Standard_DS14_v2" )
        };

        public static List<SelectListItem> ValuesItems
        {
            get
            {
                List<SelectListItem> values = new List<SelectListItem>();

                var itemsGrouped = Values.GroupBy(i => i.GroupName);

                foreach (var group in itemsGrouped)
                {
                    var selectGroup = new SelectListGroup { Name = group.Key };

                    foreach (var item in group)
                        values.Add(new SelectListItem(item.Value, item.Key) { Group = selectGroup });
                }

                return values;

            }

        }
    }
}
