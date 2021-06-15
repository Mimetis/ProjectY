using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Cli.NetCore.Configuration
{
    public class YConfigurationSource : JsonConfigurationSource
    {
        public override IConfigurationProvider Build(IConfigurationBuilder builder)
        {
            FileProvider ??= builder.GetFileProvider();

            return new YConfigurationProvider(this);
        }
    }
}
