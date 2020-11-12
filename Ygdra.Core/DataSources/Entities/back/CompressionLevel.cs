using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.DataSources.Entities
{

    public class CompressionLevel
    {
        public CompressionLevel()
        {

        }
        public CompressionLevel(string value)
        {
            Value = value;
        }

        public static CompressionLevel Fastest => new CompressionLevel("Fastest");
        public static CompressionLevel Optimal => new CompressionLevel("Optimal");
        public static CompressionLevel None => new CompressionLevel(null);

        public string Value { get; set; }

    }

}
