using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using Ygdra.Core.Cloud;
using Ygdra.Core.Cloud.Entities;
using Ygdra.Core.Engine;
using Ygdra.Core.Http;
using Ygdra.Core.Options;
using Ygdra.Core.Payloads;
using Ygdra.Host.Extensions;

namespace Ygdra.Host.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [Produces("application/json")]
    public class KeyVaultsController : ControllerBase
    {
        private IYResourceClient resourceClient;
        private readonly IYHttpRequestHandler client;
        private readonly IYEngineProvider engineProvider;
        private YMicrosoftIdentityOptions options;
        private const string KeyVaultApiVersion = "2019-09-01";

        public KeyVaultsController(IYResourceClient resourceClient,
            IYHttpRequestHandler client,
            IYEngineProvider engineProvider, IOptions<YMicrosoftIdentityOptions> azureAdOptions)
        {
            this.resourceClient = resourceClient;
            this.client = client;
            this.engineProvider = engineProvider;
            this.options = azureAdOptions.Value;

        }

        [HttpPut()]
        [Route("{engineId}")]
        public async Task<ActionResult<YResource>> CreateKeyVaultAsync(Guid engineId, [FromBody] YKeyVaultPayload payload)
        {
            payload.Location.EnsureLocation();

            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            if (string.IsNullOrEmpty(engine.ResourceGroupName))
                throw new Exception("Resource group name does not exists");

            if (string.IsNullOrEmpty(engine.KeyVaultName))
                throw new Exception("Keyvault name does not exists");

            // Create Azure Key Vault payload
            var resourceRequest = new YResource
            {
                Location = engine.Location,
                Properties = new Dictionary<string, object>
                    {
                        {"tenantId",this.options.TenantId },
                        {"sku", new JObject { { "family", "A" }, { "name", "Standard" }} },
                        {"networkAcls", new JObject{{"defaultAction", "Allow" }, { "bypass", "AzureServices"} } },
                        {"enablePurgeProtection", "true" },
                        {"enableSoftDelete", "true" },
                        {"accessPolicies", new JArray {
                            new JObject{
                                { "tenantId", this.options.TenantId },
                                { "objectId", this.options.ClientObjectId},
                                { "permissions",
                                           new JObject {
                                                    {"keys", new JArray { "get", "list", "create", "update", "delete", "backup", "restore", "recover", "purge" } },
                                                    {"secrets", new JArray { "get", "list", "set", "delete", "backup", "restore", "recover", "purge" } },
                                                    {"certificates", new JArray { "get", "list", "create", "update", "delete", "recover", "purge" } }
                                                }
                                }
                            }
                        }}
                    }
            };


            var resourceResponse = await this.resourceClient.StartCreateOrUpdateAsync
                (engine.ResourceGroupName, "Microsoft.KeyVault", "", "vaults", engine.KeyVaultName, KeyVaultApiVersion, resourceRequest);

            return resourceResponse.Value;

        }

        [HttpDelete()]
        [Route("{engineId}")]
        public async Task<ActionResult<YResource>> DeleteKeyVaultAsync(Guid engineId)
        {

            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            if (string.IsNullOrEmpty(engine.ResourceGroupName))
                throw new Exception("Resource group name does not exists");

            if (string.IsNullOrEmpty(engine.KeyVaultName))
                throw new Exception("Keyvault name does not exists");

            var resourceResponse = await this.resourceClient.StartDeleteAsync
                (engine.ResourceGroupName, "Microsoft.KeyVault", "", "vaults", engine.KeyVaultName, KeyVaultApiVersion);

            return resourceResponse.Value;

        }

        [HttpGet()]
        [Route("{engineId}")]
        public async Task<ActionResult<YResource>> GetKeyVaultAsync(Guid engineId)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            if (string.IsNullOrEmpty(engine.ResourceGroupName))
                throw new Exception("Resource group name does not exists");

            if (string.IsNullOrEmpty(engine.KeyVaultName))
                throw new Exception("Keyvault name does not exists");

            var resourceResponse = await this.resourceClient.GetAsync
                (engine.ResourceGroupName, "Microsoft.KeyVault", "", "vaults", engine.KeyVaultName, KeyVaultApiVersion);

            return resourceResponse.Value;

        }


        [HttpGet()]
        [Route("{engineId}/secrets/{key}")]
        public async Task<KeyVaultSecret> GetKeyVaultSecret(Guid engineId, string key)
        {
            try
            {

                var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

                if (engine == null)
                    throw new Exception("Engine does not exists");

                if (string.IsNullOrEmpty(engine.ResourceGroupName))
                    throw new Exception("Resource group name does not exists");

                if (string.IsNullOrEmpty(engine.KeyVaultName))
                    throw new Exception("Keyvault name does not exists");

                var kvUri = $"https://{engine.KeyVaultName}.vault.azure.net/";

                var credentials = new ClientSecretCredential(this.options.TenantId, this.options.ClientId, this.options.ClientSecret);
                var client = new SecretClient(new Uri(kvUri), credentials);

                var secret = await client.GetSecretAsync(key);
                return secret.Value;
            }
            catch (Exception)
            {

                return null;
            }
        }

        [HttpDelete()]
        [Route("{engineId}/secrets/{key}")]
        public async Task<DeletedSecret> DeleteKeyVaultSecret(Guid engineId, string key)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            if (string.IsNullOrEmpty(engine.ResourceGroupName))
                throw new Exception("Resource group name does not exists");

            if (string.IsNullOrEmpty(engine.KeyVaultName))
                throw new Exception("Keyvault name does not exists");

            var kvUri = $"https://{engine.KeyVaultName}.vault.azure.net/";

            var credentials = new ClientSecretCredential(this.options.TenantId, this.options.ClientId, this.options.ClientSecret);
            var client = new SecretClient(new Uri(kvUri), credentials);

            var secret = await client.StartDeleteSecretAsync(key);

            return secret.Value;
        }

        [HttpPut()]
        [Route("{engineId}/secrets/{key}")]
        public async Task<ActionResult<KeyVaultSecret>> SetKeyVaultSecret(Guid engineId, string key, [FromBody] YKeyVaultSecretPayload secret)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            if (string.IsNullOrEmpty(engine.ResourceGroupName))
                throw new Exception("Resource group name does not exists");

            if (string.IsNullOrEmpty(engine.KeyVaultName))
                throw new Exception("Keyvault name does not exists");

            if (!string.Equals(secret.Key, key, StringComparison.InvariantCulture))
                throw new Exception("Mismatch between the GET url secret key and the payload secret key. Both should be same");

            var kvUri = $"https://{engine.KeyVaultName}.vault.azure.net/";

            var credentials = new ClientSecretCredential(this.options.TenantId, this.options.ClientId, this.options.ClientSecret);
            var client = new SecretClient(new Uri(kvUri), credentials);

            var keyVaultSecret = new KeyVaultSecret(secret.Key, secret.Value);
            var r = await client.SetSecretAsync(keyVaultSecret);

            return r.Value;
        }

    }
}
