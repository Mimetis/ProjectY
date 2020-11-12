using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Ygdra.Core.Services
{
    public class YNameGenerator
    {
        public static string GetRandomName(int length = 4, string pref = default)
        {
            var str1 = Path.GetRandomFileName().Replace(".", "").ToLowerInvariant();
            str1 = str1.Substring(0, Math.Min(str1.Length, length));

            if (!string.IsNullOrEmpty(pref))
                str1 = str1.Substring(1, Math.Max(0, str1.Length - pref.Length));

            return $"{pref}{str1}";
        }

    }
}
