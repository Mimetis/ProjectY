using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Ygdra.Core.Extensions
{
    public static class JsonExtensions
    {

        public static void Merge(this JObject o, string propertyName, JToken val)
        {
            o.Merge(new JObject { { propertyName, val } });
        }

        public static void Merge(this JToken o, string propertyName, JToken val)
        {
            if (!(o is JObject))
                throw new Exception("Cant merge a non JObject type");

            ((JObject)o).Merge(new JObject { { propertyName, val } });
        }


        public static void Merge(this JArray array, string propertyName, JToken val)
        {
            var value = array.FirstOrDefault(jt => jt.Value<string>().StartsWith($"ProjectY_{propertyName}"));
            if (value != null)
            {
                var indexVersion = array.IndexOf(value);
                array[indexVersion] = $"ProjectY_{propertyName}={val}";
            }
            else
            {
                array.Add($"ProjectY_{propertyName}={val}");
            }
        }


    }
}
