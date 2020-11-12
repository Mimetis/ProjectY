using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.TokenCacheProviders.Distributed;
using Microsoft.Identity.Web.TokenCacheProviders.InMemory;
using Microsoft.Identity.Web.TokenCacheProviders.Session;
using Microsoft.Identity.Web.UI;
using Ygdra.Web.UI.Middlewares;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using System.Security.Claims;
using Ygdra.Core.Services;
using Ygdra.Core.Options;
using Ygdra.Core.Auth;
using Ygdra.Core.Http;
using Ygdra.Core.Cloud;
using Newtonsoft.Json;
using Ygdra.Web.UI.SignalR;
using Microsoft.Azure.SignalR.Management;
using Microsoft.Azure.SignalR;
using Ygdra.Web.UI.ModelBinders;

namespace Ygdra.WebUI
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
            services.AddControllers()
                .AddControllersAsServices()
                // Adding option to ignore Null values when sending back JsonResult from any Web Api
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.IgnoreNullValues = true;
                    options.JsonSerializerOptions.WriteIndented = true;
                })
                // Adding this option to be able to send back JObjet from any Web Api
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                    options.SerializerSettings.Formatting = Formatting.Indented;
                });

            services.AddHttpClient();
            services.AddHttpContextAccessor();
            services.AddOptions();
            services.AddDistributedMemoryCache();

            services.Configure<CookiePolicyOptions>(options =>
            {
                options.CheckConsentNeeded = context => true; // consent required
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });


            services.AddSession(option =>
            {
                option.IdleTimeout = TimeSpan.FromMinutes(45);
                option.Cookie.IsEssential = true;
            });

            services.Configure<YGraphOptions>(options => Configuration.Bind("Graph", options));
            services.Configure<YHostOptions>(options => Configuration.Bind("YgdraServices", options));
            services.Configure<YMicrosoftIdentityOptions>(options => Configuration.Bind("AzureAD", options));


            // Need an instance to get the scopes...
            var graphOptions = new YGraphOptions();
            Configuration.Bind("Graph", graphOptions);

            services.AddMicrosoftIdentityWebAppAuthentication(Configuration)
                    .EnableTokenAcquisitionToCallDownstreamApi(graphOptions.GetScopes())
                    .AddSessionTokenCaches();

            services.AddScoped<IYAuthProvider, YAuthProvider>();
            services.AddScoped<IYHttpRequestHandler, YHttpRequestHandler>();
            services.AddScoped<IYResourceClient, YResourceClient>();

            services.AddMicrosoftGraph(Configuration);

            services.AddControllersWithViews().AddMicrosoftIdentityUI();

            services.AddRazorPages()
                 .AddMvcOptions(options =>
                 {
                     options.ModelBinderProviders.Insert(0, new PolymorphicEntitySourceBinderProvider());
                     options.ModelBinderProviders.Insert(0, new PolymorphicDataSourceViewModelBinderProvider());
                 });

            services.AddControllers();

            var signalROptions = new YSignalROptions();
            Configuration.Bind("SignalR", signalROptions);

            //var serviceManager = new ServiceManagerBuilder().WithOptions(option =>
            //{
            //    option.ConnectionString = signalROptions.ConnectionString;
            //    option.ServiceTransportType = ServiceTransportType.Persistent;
            //}).Build();
            //services.AddSingleton(serviceManager);

            services.AddSignalR().AddAzureSignalR(options =>
            {
                options.ConnectionString = signalROptions.ConnectionString;
                options.ServerStickyMode = ServerStickyMode.Required;
            });

            //services.AddSignalR(options =>
            //{
            //});
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IHttpContextAccessor httpContextAccessor)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseCookiePolicy();
            app.UseSession();

            app.UseRouting();


            app.UseAuthentication();
            app.UseAuthorization();

            app.UseMiddleware<EnsureTokenAndCookieAuthMiddleware>();
            //app.UseSignalR(endpoints => endpoints.MapHub<JobHub>("/notifications"));
            app.UseAzureSignalR(endpoints => endpoints.MapHub<JobHub>("/notifications"));


            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");

                endpoints.MapRazorPages();
                endpoints.MapControllers();

            });

        }
    }
}
