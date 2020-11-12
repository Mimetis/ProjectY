using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.DataSources.Entities
{
    public class EncodingName
    {
        public EncodingName()
        {
            Value = "UTF-8";
        }
        public EncodingName(string value)
        {
            Value = value;
        }

        public static EncodingName UTF8 => new EncodingName("UTF-8");
        public static EncodingName UTF7 => new EncodingName("UTF-7");
        public static EncodingName UTF16 => new EncodingName("UTF-16");
        public static EncodingName UTF16BE => new EncodingName("UTF-16BE");
        public static EncodingName UTF32 => new EncodingName("UTF-32");
        public static EncodingName UTF32BE => new EncodingName("UTF-32BE");
        public static EncodingName USASCII => new EncodingName("US-ASCII");
        public static EncodingName Default => new EncodingName("UTF-8");

        public string Value { get; set; }

    }
}
