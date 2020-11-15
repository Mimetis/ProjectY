using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace Ygdra.Core.Http
{
    public class YHttpSerializer : IYHttpSerializer
    {
        private readonly JsonSerializer serializer;

        public YHttpSerializer()
        {
            this.serializer = new JsonSerializer
            {
                NullValueHandling = NullValueHandling.Ignore,
                Formatting = Formatting.Indented
            };
            this.serializer.Converters.Add(new YResourceJsonConverter());
            this.serializer.Converters.Add(new StringEnumConverter());
        }
        public Task<T> DeserializeAsync<T>(Stream ms)
        {
            using var sr = new StreamReader(ms);
            using var jtr = new JsonTextReader(sr);

            T t = this.serializer.Deserialize<T>(jtr);

            return Task.FromResult(t);

        }
        public async Task<byte[]> SerializeAsync<T>(T obj)
        {

            using var ms = new MemoryStream();
            using var sw = new StreamWriter(ms);
            using var jtw = new JsonTextWriter(sw);

            this.serializer.Serialize(jtw, obj);

            await jtw.FlushAsync();
            await sw.FlushAsync();

            return ms.ToArray();
        }
    }
}
