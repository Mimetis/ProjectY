using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.Graph;
using Microsoft.Identity.Client;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Security.Claims;
using System.Text;
using Ygdra.Core.Auth;
using Ygdra.Core.Graph;
using Ygdra.Core.Options;


namespace Microsoft.Extensions.DependencyInjection
{
    public static class YGraphExtensions
    {
        /// <summary>
        /// Add a IAuthProvider and IGraphProvider singleton
        /// </summary>
        public static IServiceCollection AddMicrosoftGraph(this IServiceCollection services, IConfiguration configuration, string configSectionName = "Graph")
        {
            // Register Configuration as available as IOption<GraphOptions>
            services.Configure<YGraphOptions>(options => configuration.Bind(configSectionName, options));

            // Add required services, in case we don't have them yet
            services.AddScoped<IYAuthProvider, YAuthProvider>();
            services.AddHttpContextAccessor();
            services.AddHttpClient();

            // Add GraphClient provider
            services.AddScoped(serviceProvider =>
            {
                // Get auth provider
                var authProvider = serviceProvider.GetService<IYAuthProvider>();

                // get MSAL graph client
                var msalGraphClient = new GraphServiceClient(authProvider as IAuthenticationProvider);

                // Create Wrapper IGraphClient
                IYGraphProvider client = new YGraphProvider(msalGraphClient);

                return client;
            });

            return services;
        }

    }
}
