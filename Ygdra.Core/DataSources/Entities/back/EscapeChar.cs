using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.DataSources.Entities
{
    public class EscapeChar
    {
        public EscapeChar()
        {

        }
        public EscapeChar(string value)
        {
            Value = value;
        }

        public static EscapeChar BackSlash => new EscapeChar("\\");
        public static EscapeChar Slash => new EscapeChar("/");
        public static EscapeChar None => new EscapeChar(null);

        public string Value { get; set; }



    }
}
