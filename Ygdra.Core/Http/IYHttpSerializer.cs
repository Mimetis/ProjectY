using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace Ygdra.Core.Http
{
    public interface IYHttpSerializer
    {
        Task<T> DeserializeAsync<T>(Stream ms);
        Task<byte[]> SerializeAsync<T>(T obj);
    }
}
