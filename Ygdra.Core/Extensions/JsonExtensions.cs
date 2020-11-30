using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.Extensions
{
    public static class JsonExtensions
    {

        public static void Merge(this JObject o, string propertyName, JToken val)
        {
            o.Merge(new JObject { { propertyName, val } });
        }

        public static void Merge(this JArray o, string propertyName, JToken val)
        {
            o.Merge(new JObject { { propertyName, val } });
        }

        public static void Merge(this JToken o, string propertyName, JToken val)
        {
            if (!(o is JObject))
                throw new Exception("Cant merge a non JObject type");

            ((JObject)o).Merge(new JObject { { propertyName, val } });
        }



    }
}
