using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Ygdra.Core.Cloud.Entities;
using Ygdra.Core.DataSources.Entities;

namespace Ygdra.Core.Http
{
    //public class YDataSourceJsonConverter : JsonConverter
    //{

    //    public override bool CanConvert(Type objectType)  => objectType.IsAssignableFrom(typeof(YDataSource));
    //    public override bool CanRead => true;
    //    public override bool CanWrite => false;
    //    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    //    {
    //        if (reader.TokenType == JsonToken.Null)
    //            return null;

    //        JObject jsonObject = JObject.Load(reader);

    //        if (jsonObject.TryGetValue("dataSourceName", out var jtoken))
    //            return jsonObject.ToObject<YDataSource>();
            

    //        var dataSource = new YDataSource
    //        {
    //            DataSourceName = jsonObject["name"].ToString()
    //        };

    //        dataSource.Type = jsonObject["properties"]["type"].ToString();

    //        foreach (var property in jsonObject["properties"]["typeProperties"].Children<JProperty>())
    //        {
    //            if (property.Name == "encryptedCredential")
    //                continue;

    //            var val = ((JValue)property.Value).Value;

    //            dataSource.Properties.Add(property.Name, val.ToString());
    //        }

    //        return dataSource;
    //    }

    //    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer) => throw new NotImplementedException();
    //}
}
