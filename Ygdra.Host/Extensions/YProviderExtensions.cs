using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ygdra.Core.Engine;
using Ygdra.Core.Notifications;
using Ygdra.Core.Options;
using Ygdra.Core.Settings;
using Ygdra.Host.CosmosDb;

namespace Ygdra.Host.Extensions
{
    public static class YProviderExtensions
    {
        /// <summary>
        /// Add the backend provider used to store Y informations
        /// </summary>
        public static IServiceCollection AddYProvider(
          this IServiceCollection services,
          IConfiguration configuration,
          string configSectionName = "YProvider")
        {

            var options = new YProviderOptions();
            configuration.Bind(configSectionName, options);

            // new switch style
            switch (options.Provider)
            {
                // Replace with Sql Server when the provider will be ready
                case "YSqlProvider":
                default:
                    services.AddSingleton<IYEngineProvider, YCosmosDbEngineProvider>();
                    services.AddSingleton<IYNotificationProvider, YCosmosDbNotificationProvider>();
                    services.AddSingleton<IYSettingProvider, YCosmosDbSettingProvider>();
                    break;
            };

            return services;
        }


        /// <summary>
        /// Add Swagger UI and inject ClientId parameter used to authenticate
        /// </summary>
        public static IApplicationBuilder UseAzureSwaggerUi(
            this IApplicationBuilder builder,
            string name,
            IConfiguration configuration,
            string configSectionName = "AzureAd")
        {

            var options = new YMicrosoftIdentityOptions();
            configuration.Bind(configSectionName, options);

            builder.UseSwaggerUI(setup =>
            {
                setup.SwaggerEndpoint("/swagger/v1/swagger.json", name);
                setup.OAuthClientId(options.ClientId);
                setup.OAuthAppName("Ygdra");

                // Not needed when using Implicit flow
                // setup.OAuthUseBasicAuthenticationWithAccessCodeGrant();
            });

            return builder;
        }


        /// <summary>
        /// Add Swagger generation, with OAuth2 implicit flow configured with Azure Ad
        /// </summary>
        public static IServiceCollection AddAzureOauth2Swagger(
          this IServiceCollection services,
          IConfiguration configuration,
          string azureOptionsSectionName = "AzureAD",
          string configSectionName = "YgdraServices")
        {

            var options = new YHostOptions();
            configuration.Bind(configSectionName, options);

            var azureOptions = new YMicrosoftIdentityOptions();
            configuration.Bind(azureOptionsSectionName, azureOptions);


            var scopes = options.GetScopes().Select(scope => $"https://{azureOptions.Domain}/{azureOptions.ClientId}/{scope}");


            // Define the OAuth2.0 scheme that's in use (i.e. Implicit Flow)
            services.AddSwaggerGen(c =>
            {
                c.AddSecurityDefinition("OAuth2", new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.OAuth2,
                    Flows = new OpenApiOAuthFlows
                    {
                        Implicit = new OpenApiOAuthFlow
                        {
                            AuthorizationUrl = new Uri("https://login.microsoftonline.com/common/oauth2/v2.0/authorize"),
                            TokenUrl = new Uri("https://login.microsoftonline.com/common/oauth2/v2.0/token"),
                            Scopes = scopes.ToDictionary(s => s, s => s)
                        }
                    }
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "OAuth2" },
                        },
                        scopes.ToList()
                    }
                });
            });

            return services;
        }



    }
}
