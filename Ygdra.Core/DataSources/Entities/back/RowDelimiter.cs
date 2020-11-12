using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.DataSources.Entities
{
    public class RowDelimiter
    {
        public RowDelimiter()
        {

        }
        public RowDelimiter(string value)
        {
            Value = value;
        }

        public static RowDelimiter AutoDetect => new RowDelimiter(null);
        public static RowDelimiter LineFeed => new RowDelimiter("\\n");
        public static RowDelimiter CariageReturn => new RowDelimiter("\\r");
        public static RowDelimiter None => new RowDelimiter(null);

        public string Value { get; set; }



    }
}
