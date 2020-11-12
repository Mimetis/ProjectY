using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Ygdra.Core.Cloud.Entities;

namespace Ygdra.Core.Http
{
    public class YResourceJsonConverter : JsonConverter
    {

        public override bool CanConvert(Type objectType) 
            => objectType.IsAssignableFrom(typeof(YResource));

        public override bool CanRead => true;

        /// <summary>
        /// This JsonConverter is used only for deserialization. The serialization is deferred to the basic JsonConvert stuff
        /// </summary>
        public override bool CanWrite => false;


        /// <summary>
        /// Recurse reading the properties JObject returned
        /// </summary>
        private object RecurseProperty(JToken jToken)
        {

            if (jToken is JArray jArray)
            {
                var collection = new List<object>();

                foreach (var jArrayElement in jArray)
                {
                    var newCollection = RecurseProperty(jArrayElement);
                    collection.Add(newCollection);
                }
                return collection;
            }

            var dictionary = new Dictionary<string, object>();

            foreach (var property in jToken.Children<JProperty>())
            {
                if (property.Value is JContainer newJContainer)
                {
                    var newJobjectCollection = RecurseProperty(newJContainer);
                    dictionary.Add(property.Name, newJobjectCollection);
                }
                else
                {
                    var val = ((JValue)property.Value).Value;
                    dictionary.Add(property.Name, val);
                }

            }

            return dictionary;
        }


        /// <summary>
        /// Read the json coming back from Azure. Since Properties node is Object, make a recurse read to extract dictionary
        /// </summary>
        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.Null)
                return null;

            JObject jsonObject = JObject.Load(reader);

            var yResource = jsonObject.ToObject<YResource>();

            // Get All properties that are not simple values, and then make a recurse parsing on them
            var properties = yResource?.Properties?.Where(p => p.Value is JContainer).ToArray();

            if (properties != null)
            {
                foreach (var prop in properties)
                {
                    var jObject = prop.Value as JContainer;

                    var collection = RecurseProperty(jObject);

                    yResource.Properties[prop.Key] = collection;
                }
            }

            return yResource;
        }

        /// <summary>
        /// The Write process is handled by inner JsonSerializer
        /// </summary>
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }
    }
}
