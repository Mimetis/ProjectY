using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.DataSources.Entities
{
    public class QuoteChar
    {
        public QuoteChar()
        {

        }
        public QuoteChar(string value)
        {
            Value = value;
        }

        public static QuoteChar DoubelQuote => new QuoteChar("\"");
        public static QuoteChar SingleQuote => new QuoteChar("'");
        public static QuoteChar None => new QuoteChar(null);

        public string Value { get; set; }



    }
}
