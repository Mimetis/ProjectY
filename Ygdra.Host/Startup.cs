using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Hangfire;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.SignalR.Management;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Client;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.TokenCacheProviders.InMemory;
using Microsoft.Identity.Web.TokenCacheProviders.Session;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Ygdra.Core.Auth;
using Ygdra.Core.Cloud;
using Ygdra.Core.Http;
using Ygdra.Core.Notifications;
using Ygdra.Core.Options;
using Ygdra.Host.BackgroundServices;
using Ygdra.Host.Extensions;
using Ygdra.Host.Services;

namespace Ygdra.Host
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            IdentityModelEventSource.ShowPII = true;

            services.AddControllers()
                .AddControllersAsServices()
                // Adding this option to be able to send back JObjet from any Web Api
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                    options.SerializerSettings.Formatting = Formatting.Indented;
                    options.SerializerSettings.Converters.Add(new StringEnumConverter());
                });

            // Allow Any origin
            services.AddCors(options => options.AddDefaultPolicy(builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

            services.Configure<YGraphOptions>(options => Configuration.Bind("Graph", options));
            services.Configure<YProviderOptions>(options => Configuration.Bind("YProvider", options));
            services.Configure<YHostOptions>(options => Configuration.Bind("YgdraServices", options));
            services.Configure<YPurviewOptions>(options => Configuration.Bind("Purview", options));
            services.Configure<YMicrosoftIdentityOptions>(options => Configuration.Bind("AzureAD", options));


            var hangFireOptions = new YProviderOptions();
            Configuration.Bind("HangFire", hangFireOptions);


            services.AddHangfire(x => x.UseAzureCosmosDbStorage(hangFireOptions.Endpoint,
                                                                hangFireOptions.AccountKey,
                                                                hangFireOptions.Database,
                                                                hangFireOptions.Container));
            services.AddHangfireServer();

            // For Production deployment
            services.AddMicrosoftIdentityWebApiAuthentication(Configuration)
                    .EnableTokenAcquisitionToCallDownstreamApi()
                    .AddInMemoryTokenCaches();

            // -----------------------------------------------------------------------------------
            // For dev only (Because Microsoft does not authorize to add API without admin consent)

            // Override Token Validation Parameters
            services.AddOptions<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme)
                .Configure(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        //ValidateIssuerSigningKey = false,
                        //ValidateActor = false,
                    };

                    // Be sure we have events
                    options.Events ??= new JwtBearerEvents();

                    // Get already handler on Validation to be able to call it
                    var onTokenValidatedHandler = options.Events.OnTokenValidated;

                    // Create a new one
                    options.Events.OnTokenValidated = async context =>
                    {
                        // Because we can't consent the scope of the web api (MS tenant does not authorize it)
                        // We don't validated neither scope neither roles
                        await Task.CompletedTask;

                        // If we can have an admin consent on application consent for web url, we may want to 
                        // test it again here
                        //await onTokenValidatedHandler(context).ConfigureAwait(false);
                    };

                    var onAuthenticationFailedHandler = options.Events.OnAuthenticationFailed;

                    options.Events.OnAuthenticationFailed = async context =>
                    {
                        Console.WriteLine("OnAuthenticationFailed: " + context.Exception.Message);
                        await onAuthenticationFailedHandler(context).ConfigureAwait(false);
                    };


                });


            services.AddYProvider(Configuration);

            services.AddHttpClient();
            services.AddHttpContextAccessor();

            services.AddScoped<IYAuthProvider, YAuthProvider>();
            services.AddScoped<IYHttpRequestHandler, YHttpRequestHandler>();
            services.AddScoped<IYResourceClient, YResourceClient>();
            services.AddScoped<IYNotificationsService, YNotificationsService>();
            services.AddScoped<IYEnginesService, YEnginesService>();
            services.AddScoped<IYHangFireService, YHangFireService>();
            services.AddScoped<IYDataSourcesService, YDataSourcesService>();

            // Configure Swagger correctly to add an authorization button and inject bearer token to all needed calls
            services.AddAzureOauth2Swagger(Configuration);

            var signalROptions = new YSignalROptions();
            Configuration.Bind("SignalR", signalROptions);

            var serviceManager = new ServiceManagerBuilder().WithOptions(option =>
            {
                option.ConnectionString = signalROptions.ConnectionString;
                option.ServiceTransportType = ServiceTransportType.Persistent;
            }).Build();

            services.AddSingleton(serviceManager);

            services.AddSignalR().AddAzureSignalR(options =>
            {
                options.ConnectionString = signalROptions.ConnectionString;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            //if (env.IsDevelopment())
            //{
            //    app.UseDeveloperExceptionPage();
            //}
            //else
            //{

            //}
            app.UseExceptionHandler("/yerror");


            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors();

            app.UseAuthentication();

            app.UseAuthorization();
            app.UseSwagger();
            // Add Swagger UI and needed params (like client id)
            app.UseAzureSwaggerUi("Ygdra Api", Configuration);

            app.UseHangfireDashboard("/hangfire");

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
