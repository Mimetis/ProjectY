using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Tests.Misc
{
    [Flags]
    public enum ProviderType
    {
        Sql = 0x1,
        CosmosDb = 0x2,

    }

    public static class EnumExtensions
    {
        /// <summary>
        /// Funny extension method to be able to retrieve all the enum flags I set
        /// </summary>
        public static IEnumerable<Enum> GetFlags(this Enum input)
        {
            foreach (Enum value in Enum.GetValues(input.GetType()))
                if (input.HasFlag(value))
                    yield return value;
        }
    }

}
