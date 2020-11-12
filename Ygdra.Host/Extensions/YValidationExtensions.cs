using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Ygdra.Host.Extensions
{
    public static class YValidationExtensions
    {
        public static string[] Locations => new string[]{
                "westus", "eastus2", "westeurope", "eastus", "northeurope", "southeastasia", "eastasia", "southcentralus", "northcentralus",
                "westus2", "centralus", "ukwest", "uksouth", "australiaeast", "australiasoutheast", "australiacentral", "australiacentral2",
                "japaneast", "japanwest", "canadacentral", "canadaeast", "centralindia", "southindia", "westindia",
                "koreacentral", "koreasouth", "southafricawest", "southafricanorth", "brazilsouth", "francecentral", "uaenorth"};

        public static void EnsureLocation(this string location)
        {

            if (!Locations.Any(l => string.Equals(l, location, StringComparison.InvariantCultureIgnoreCase)))
                throw new Exception($"The location {location} is not supported. Available locations: {string.Join(", ", Locations)}");

        }

        public static void EnsureStringIsLetterOrDigit(this string val)
        {
            //var isLetterOrDigit = val.All(char.IsLetterOrDigit);

            Regex reg = new Regex(@"[^A-Za-z0-9\-_]+");

            var containsIllegalCharacters = reg.IsMatch(val);

            if (containsIllegalCharacters)
                throw new Exception($"The string value {val} has illegal characters that are not supported by the platform");

        }

    }
}
