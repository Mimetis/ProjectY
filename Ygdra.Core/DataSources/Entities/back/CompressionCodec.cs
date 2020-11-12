using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.DataSources.Entities
{


    public class CompressionCodec
    {
        public CompressionCodec()
        {

        }
        public CompressionCodec(string value)
        {
            Value = value;
        }

        public static CompressionCodec Bzip2 => new CompressionCodec("bzip2");
        public static CompressionCodec Gzip => new CompressionCodec("gzip");
        public static CompressionCodec Deflate => new CompressionCodec("deflate");
        public static CompressionCodec ZipDeflate => new CompressionCodec("ZipDeflate");
        public static CompressionCodec TarGZip => new CompressionCodec("TarGZip");
        public static CompressionCodec Snappy => new CompressionCodec("snappy");
        public static CompressionCodec Lz4 => new CompressionCodec("lz4");
        public static CompressionCodec None => new CompressionCodec(null);

        public string Value { get; set; }

    }

}
