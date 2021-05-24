using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Hangfire;
using Hangfire.Storage;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.SignalR.Management;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Client;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.Resource;
using Newtonsoft.Json.Linq;
using Ygdra.Core.Cloud;
using Ygdra.Core.Engine;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Http;
using Ygdra.Core.Options;
using Ygdra.Core.Payloads;
using Ygdra.Core.Services;
using Ygdra.Core.Settings;
using Ygdra.Host.BackgroundServices;
using Ygdra.Host.Extensions;
using Ygdra.Host.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Ygdra.Host.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [Produces("application/json")]
    public class EnginesController : ControllerBase
    {
        private readonly IYSettingProvider settingsProvider;
        private readonly IYEngineProvider engineProvider;
        private readonly IYEnginesService enginesService;
        private readonly IYNotificationsService notificationsService;
        private readonly IYHangFireService hangFireService;
        private readonly YMicrosoftIdentityOptions options;
        static readonly string[] scopeRequiredByApi = new string[] { "user_impersonation" };

        public EnginesController(IYSettingProvider settingsProvider,
                                 IYEngineProvider engineProvider,
                                 IYEnginesService enginesService,
                                 IYNotificationsService notificationsService,
                                 IYHangFireService hangFireService,
                                 IOptions<YMicrosoftIdentityOptions> options)
        {
            this.settingsProvider = settingsProvider;
            this.engineProvider = engineProvider;
            this.enginesService = enginesService;
            this.notificationsService = notificationsService;
            this.hangFireService = hangFireService;
            this.options = options.Value;
        }


        [HttpPost("{id}/deploy")]
        public async Task<ActionResult<YDeploymentStatePayload>> DeployEngineAsync(Guid id, [FromBody] YEngine engine)
        {
            HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);

            if (!this.User.IsInRole("Admin"))
                return new UnauthorizedObjectResult("You should be admin to make a deployment");

            var userObjectId = this.User.GetObjectId();

            if (string.IsNullOrEmpty(userObjectId))
                return new UnauthorizedObjectResult("User unknown");

            var userId = new Guid(userObjectId);

            engine = await this.engineProvider.GetEngineAsync(id).ConfigureAwait(false);

            var settings = await this.settingsProvider.GetSettingsAsync().ConfigureAwait(false);

            if (settings != null)
            {
                if (string.IsNullOrEmpty(engine.ResourceGroupName))
                {
                    string prefix = settings.FirstOrDefault(s => s.Name == "ResourceGroupPrefix")?.Value ?? "rg";
                    string suffix = settings.FirstOrDefault(s => s.Name == "ResourceGroupSuffix")?.Value;

                    string name = $"{prefix}{engine.EngineName}{suffix}";
                    engine.ResourceGroupName = name;
                }
                if (string.IsNullOrEmpty(engine.ClusterName))
                {
                    string prefix = settings.FirstOrDefault(s => s.Name == "DatabricksWorkspacePrefix")?.Value ?? "dw";
                    string suffix = settings.FirstOrDefault(s => s.Name == "DatabricksWorkspaceSuffix")?.Value;

                    string name = $"{prefix}{engine.EngineName}{suffix}";
                    engine.ClusterName = name;
                }
                if (string.IsNullOrEmpty(engine.FactoryName))
                {
                    string prefix = settings.FirstOrDefault(s => s.Name == "DataFactoryPrefix")?.Value ?? "df";
                    string suffix = settings.FirstOrDefault(s => s.Name == "DataFactorySuffix")?.Value;

                    string name = $"{prefix}{engine.EngineName}{suffix}";
                    engine.FactoryName = name;
                }
                if (string.IsNullOrEmpty(engine.KeyVaultName))
                {
                    string prefix = settings.FirstOrDefault(s => s.Name == "KeyVaultPrefix")?.Value ?? "kv";
                    string suffix = settings.FirstOrDefault(s => s.Name == "KeyVaultSuffix")?.Value;

                    string name = $"{prefix}{engine.EngineName}{suffix}";
                    engine.KeyVaultName = name;
                }
                if (string.IsNullOrEmpty(engine.StorageName))
                {
                    string prefix = settings.FirstOrDefault(s => s.Name == "StoragePrefix")?.Value ?? "stor";
                    string suffix = settings.FirstOrDefault(s => s.Name == "StorageSuffix")?.Value;

                    string name = $"{prefix}{engine.EngineName}{suffix}";
                    engine.StorageName = name;
                }
                if (string.IsNullOrEmpty(engine.AppInsightsName))
                {
                    string prefix = settings.FirstOrDefault(s => s.Name == "AppInsightsPrefix")?.Value ?? "ai";
                    string suffix = settings.FirstOrDefault(s => s.Name == "AppInsightsSuffix")?.Value;

                    string name = $"{prefix}{engine.EngineName}{suffix}";
                    engine.AppInsightsName = name;
                }

                if (string.IsNullOrEmpty(engine.Location))
                {
                    string location = settings.FirstOrDefault(s => s.Name == "DefaultLocation")?.Value ?? "northeurope";
                    engine.Location = location;
                }
            }

            engine.ResourceGroupName.EnsureStringIsLetterOrDigit();
            engine.ClusterName.EnsureStringIsLetterOrDigit();
            engine.FactoryName.EnsureStringIsLetterOrDigit();
            engine.StorageName.EnsureStringIsLetterOrDigit();
            engine.AppInsightsName.EnsureStringIsLetterOrDigit();
            engine.KeyVaultName.EnsureStringIsLetterOrDigit();

            var job = this.hangFireService.GetProcessingJob(engine);

            if (job != null)
            {
                return new YDeploymentStatePayload(YDeploymentStatePayloadState.Deploying)
                {
                    Id = id,
                    Message = $"Background process indicate your engine <strong>{engine.EngineName}</strong> has a deployment already in progress.<br />You'll receive a notification when the deployment is completed."
                };
            }

            var health = await this.notificationsService.IsServiceHealthyAsync();

            if (!health)
                throw new Exception("Azure SignalR Service is not healthy");

            var jobId = BackgroundJob.Enqueue(() => enginesService.CreateEngineDeploymentAsync(engine, userId, default));

            var deployingState = new YDeploymentStatePayload(YDeploymentStatePayloadState.Deploying)
            {
                Id = id,
                Message = $"Deploying start. Background Job Id : {jobId}."
            };

            return deployingState;

        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<YDeploymentStatePayload>> DeleteEngineAsync(Guid id)
        {

            HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);

            if (!this.User.IsInRole("Admin"))
                return new UnauthorizedObjectResult("You should be admin to remove an engine and all its resources.");

            var userObjectId = this.User.GetObjectId();

            if (string.IsNullOrEmpty(userObjectId))
                return new UnauthorizedObjectResult("User unknown");

            var userId = new Guid(userObjectId);

            YEngine engine = await this.engineProvider.GetEngineAsync(id);

            if (engine == null)
                return new NotFoundObjectResult($"No engine found with Id {id}");

            var health = await this.notificationsService.IsServiceHealthyAsync();

            if (!health)
                throw new Exception("Azure SignalR Service is not healthy");


            var jobId = BackgroundJob.Enqueue(() => enginesService.DeleteEngineDeploymentAsync(engine, userId, default));

            var deployingState = new YDeploymentStatePayload(YDeploymentStatePayloadState.Deploying)
            {
                Id = id,
                Message = $"Removing engine deployment started. Background Job Id : {jobId}."
            };

            return deployingState;


        }

        /// <summary>
        /// Gets all engines for the current authenticated user
        /// </summary>
        [HttpGet()]
        public async Task<ActionResult<List<YEngine>>> GetUserEngines()
        {

            HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);

            var userClaims = this.HttpContext.User;

            var userId = this.User.GetObjectId();

            var engines = await this.engineProvider.GetEnginesAsync(new Guid(userId));

            if (engines == null || !engines.Any())
                return new OkResult();

            return engines.ToList();

        }

        [HttpGet("daemon/{id}")]
        public async Task<ActionResult<YEngine>> GetEngineFromDaemonAsync(Guid id)
        {
            var userObjectId = this.User.GetObjectId();

            if (string.IsNullOrEmpty(userObjectId))
                return new UnauthorizedObjectResult("User unknown");

            if (userObjectId != this.options.ClientObjectId)
                return new UnauthorizedObjectResult("Call not from any daemon");

            YEngine engine;

            engine = await this.engineProvider.GetEngineAsync(id).ConfigureAwait(false);

            if (engine == null)
                return NotFound($"Engine {id} does not exists");

            return engine;
        }

        [HttpGet("daemon/name/{name}")]
        public async Task<ActionResult<YEngine>> GetEngineFromNameFromDaemonAsync(string name)
        {
            var userObjectId = this.User.GetObjectId();

            if (string.IsNullOrEmpty(userObjectId))
                return new UnauthorizedObjectResult("Daemon id unknown");

            if (userObjectId != this.options.ClientObjectId)
                return new UnauthorizedObjectResult("This web api should be called only from a daemon application using the correct Client Id / Client Secret");

            YEngine engine;

            engine = await this.engineProvider.GetEngineByNameAsync(name).ConfigureAwait(false);

            if (engine == null)
                return NotFound($"Engine {name} does not exists");

            return engine;
        }



        /// <summary>
        /// Gets all engines. Used only as Admin
        /// </summary>
        [HttpGet()]
        [Route("All")]
        [Produces("application/json")]
        public async Task<ActionResult<List<YEngine>>> GetAllEnginesAsync()
        {
            HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);
            HttpContext.ValidateAppRole(new string[] { "Admin" });

            var engines = await this.engineProvider.GetEnginesAsync();

            return engines.ToList();
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<YEngine>> GetEngineAsync(Guid id)
        {
            HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);

            var userObjectId = this.User.GetObjectId();

            if (string.IsNullOrEmpty(userObjectId))
                return new UnauthorizedObjectResult("User unknown");

            var userId = new Guid(userObjectId);

            YEngine engine;

            if (this.User.IsInRole("Admin"))
                engine = await this.engineProvider.GetEngineAsync(id).ConfigureAwait(false);
            else
                engine = await this.engineProvider.GetEngineAsync(id, userId).ConfigureAwait(false);

            if (engine == null)
                return NotFound($"Engine {id} does not exists");

            return engine;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<YEngine>> SaveEngineAsync(Guid id, [FromBody] YEngine engine)
        {
            HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);

            var userObjectId = this.User.GetObjectId();

            if (id != engine.Id)
                return new UnprocessableEntityObjectResult("id and entity differs");

            if (string.IsNullOrEmpty(userObjectId))
                return new UnauthorizedObjectResult("User unknown");

            var userId = new Guid(userObjectId);

            if (!string.IsNullOrEmpty(engine.EngineName))
            {
                var regex = new Regex(@"^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$");

                if (!regex.IsMatch(engine.EngineName))
                    throw new Exception($"Engine name {engine.EngineName} is incorrect. The regex used to validate the name is {regex}");

                if (engine.EngineName.Length < 5 || engine.EngineName.Length > 10)
                    throw new Exception("The engine name needs to be between 5 and 10 characters long.");
            }

            if (!string.IsNullOrEmpty(engine.ResourceGroupName))
            {
                var regex = new Regex(@"^[-\w\._\(\)]+$");

                if (!regex.IsMatch(engine.ResourceGroupName))
                    throw new Exception($"Resource group name {engine.ResourceGroupName} is incorrect");
            }

            if (!string.IsNullOrEmpty(engine.FactoryName))
            {
                var regex = new Regex(@"^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$");

                if (!regex.IsMatch(engine.FactoryName))
                    throw new Exception($"Factory name {engine.FactoryName} is incorrect");
            }

            if (!string.IsNullOrEmpty(engine.ClusterName))
            {
                var regex = new Regex(@"^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$");

                if (!regex.IsMatch(engine.ClusterName))
                    throw new Exception($"Cluster name {engine.ClusterName} is incorrect");
            }
            if (!string.IsNullOrEmpty(engine.KeyVaultName))
            {
                var regex = new Regex(@"^[a-zA-Z0-9-]{3,24}$");

                if (!regex.IsMatch(engine.KeyVaultName))
                    throw new Exception($"KeyVault name {engine.KeyVaultName} is incorrect");
            }
            if (!string.IsNullOrEmpty(engine.StorageName))
            {
                var regex = new Regex(@"^[a-z0-9-]{3,24}$");

                if (!regex.IsMatch(engine.StorageName))
                    throw new Exception($"Storage account name {engine.StorageName} is incorrect");
            }
            if (!string.IsNullOrEmpty(engine.AppInsightsName))
            {
                var regex = new Regex(@"^[a-z0-9-]{3,24}$");

                if (!regex.IsMatch(engine.AppInsightsName))
                    throw new Exception($"AppInsights name {engine.AppInsightsName} is incorrect");
            }

            if(engine.OwnerEmails!=null && engine.OwnerEmails.Count>0)
            {
                //Lookup IDs for the provided owner email addresses to complete the request.

            }

            var existingEngine = await this.engineProvider.GetEngineByNameAsync(engine.EngineName);

            if (existingEngine != null && existingEngine.Id != engine.Id)
                throw new Exception($"The Engine {engine.EngineName} already exists. Please choose another name");

            var engineSaved = await this.engineProvider.SaveEngineAsync(engine, userId);

            if (!string.IsNullOrEmpty(engineSaved.AdminComments) && engineSaved.Status == YEngineStatus.NeedMoreInfos)
            {
                // Only send notification to owners
                var allUsersToNotify = engine.Owners?.Select(u => u.Id);

                if (allUsersToNotify != null)
                    await notificationsService.CreateNotificationsDeploymentDoneAsync(engine.Id, "Admin comments",
                        $"You have engine <a href='/Engines/Details/{engine.Id}' >admin comments</a> on engine <b>{engine.EngineName}</b>",
                        allUsersToNotify, $"/Engines/Details/{engine.Id}").ConfigureAwait(false);
            }

            return engineSaved;

        }



    }
}
