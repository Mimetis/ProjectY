using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.Entities.Entities
{

    public class YEntityFactory
    {
        public static YEntity GetTypedEntity(YEntity entity)
        {
            YEntity ev = entity.EntityType switch
            {
                YEntityType.AzureSqlTable => new YEntityAzureSqlTable(),
                YEntityType.DelimitedText => new YEntityDelimitedText(),
                _ => new YEntityUnknown(),
            };

            ev.Name = entity.Name;
            ev.AdditionalData = entity.AdditionalData;
            ev.DataSourceName = entity.DataSourceName;
            ev.EntityType = entity.EntityType;
            ev.Type = entity.Type;
            ev.Version = entity.Version;

            if (ev.AdditionalData?["properties"] is JObject props)
                ev.OnDeserialized(props);

            return ev;
        }
    }
}
