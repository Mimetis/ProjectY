using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.Options
{
    public abstract class YApiOptions
    {
        public string BaseAddress { get; set; }
        public string Scopes { get; set; }

        public IEnumerable<string> GetScopes()
        {
            if (string.IsNullOrEmpty(Scopes))
                return null;

            return Scopes.Split(new char[] { ' ' });
        }
    }
}
