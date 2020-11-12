using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.DataSources.Entities
{

    public class ColumnDelimiter
    {
        public ColumnDelimiter()
        {

        }
        public ColumnDelimiter(string value)
        {
            Value = value;
        }

        public static ColumnDelimiter Comma => new ColumnDelimiter(",");
        public static ColumnDelimiter Semicolon => new ColumnDelimiter(";");
        public static ColumnDelimiter Pipe => new ColumnDelimiter("|");
        public static ColumnDelimiter Tab => new ColumnDelimiter("\\t");
        public static ColumnDelimiter StartOfHeading => new ColumnDelimiter("\\u0001");
        public static ColumnDelimiter None => new ColumnDelimiter(null);

        public string Value { get; set; }

    }

}
