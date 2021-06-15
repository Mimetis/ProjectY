using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Ygdra.Cli.NetCore.Configuration
{
    public static class YamlConfigurationExtensions
    {

        public static IConfigurationBuilder AddYCliFile(this IConfigurationBuilder builder, bool optional = default, bool reloadOnChange = default)
        {
            var fileName = "ygdra.json";
            var rootFolder = Path.Join(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".ygdra");

            var provider = new PhysicalFileProvider(rootFolder);
            var source = new YConfigurationSource
            {
                FileProvider = provider,
                Path = fileName,
                Optional = optional,
                ReloadOnChange = reloadOnChange
            };
            builder.Add(source);
            return builder;
        }
    }
}
