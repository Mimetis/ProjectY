using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Ygdra.Cli.NetCore.Configuration
{
    public class YConfigurationProvider : JsonConfigurationProvider
    {
        public YConfigurationProvider(JsonConfigurationSource source) : base(source)
        {

        }

    }
}
