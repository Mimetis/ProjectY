using Hangfire;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Azure.SignalR.Management;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using Ygdra.Core.Auth;
using Ygdra.Core.Cloud;
using Ygdra.Core.Cloud.Entities;
using Ygdra.Core.DataSources.Entities;
using Ygdra.Core.Engine;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Http;
using Ygdra.Core.Notifications;
using Ygdra.Core.Notifications.Entities;
using Ygdra.Core.Options;
using Ygdra.Core.Payloads;
using Ygdra.Host.Controllers;
using Ygdra.Host.Services;

namespace Ygdra.Host.BackgroundServices
{
    public class YEnginesService : IYEnginesService
    {
        private readonly IYAuthProvider authProvider;
        private readonly IYHttpRequestHandler client;
        private IYResourceClient clientResource;
        private readonly IYEngineProvider engineProvider;
        private readonly KeyVaultsController keyVaultsController;
        private readonly IYNotificationsService notificationsService;
        private readonly YMicrosoftIdentityOptions options;
        private const string ApiVersion = "2020-06-01";
        private const string DataBricksApiVersion = "2018-04-01";
        private const string DataFactoryApiVersion = "2018-06-01";
        private const string KeyVaultApiVersion = "2019-09-01";
        private const string StorageApiVersion = "2019-06-01";

        public YEnginesService(IYAuthProvider authProvider,
                               IYHttpRequestHandler client,
                               IYResourceClient clientResource,
                               IYEngineProvider engineProvider,
                               KeyVaultsController keyVaultsController,
                               IYNotificationsService notificationsService,
                               IOptions<YMicrosoftIdentityOptions> azureAdOptions)
        {
            this.authProvider = authProvider;
            this.client = client;
            this.clientResource = clientResource;
            this.engineProvider = engineProvider;
            this.keyVaultsController = keyVaultsController;
            this.notificationsService = notificationsService;
            this.options = azureAdOptions.Value;
        }




        [AutomaticRetry(Attempts = 0)]
        public async Task CreateEngineDeploymentAsync(YEngine engine, Guid? callerUserId = default, CancellationToken token = default)
        {

            try
            {
                engine.Status = YEngineStatus.Deploying;
                await this.engineProvider.SaveEngineAsync(engine);

                // Create resource group
                var resourceGroup = await CreateResourceGroupAsync(engine, callerUserId, token).ConfigureAwait(false);

                // Create Keyvault
                var keyvault = await CreateAzureKeyVaultAsync(engine, callerUserId, token).ConfigureAwait(false);

                var storage = await CreateStorageAsync(engine, callerUserId, token).ConfigureAwait(false);

                // Create Databricks Workspace
                var clusterWorkspace = await CreateDatabricksWorkspaceAsync(engine, callerUserId, token).ConfigureAwait(false);

                var cluster = await CreateDatabricksClusterAsync(engine, clusterWorkspace, callerUserId, token).ConfigureAwait(false);

                // Create Azure Data Factory 
                var dataFactory = await CreateDataFactoryAsync(engine, callerUserId, token).ConfigureAwait(false);

                // Create link service for databricks
                var linkedServiceDatabricks = await CreateDataFactoryDatabricksLinkedService(engine, cluster, clusterWorkspace, callerUserId).ConfigureAwait(false);

                // Create link service for databricks
                var linkedServiceStorage = await CreateDataFactoryStorageLinkedService(engine, cluster, storage, callerUserId).ConfigureAwait(false);

                // Set a datetime to the deployment
                var message = $"{DateTime.Now.ToShortDateString()}. Deployment of your engine called {engine.EngineName} is done.";
                engine.Status = YEngineStatus.Deployed;
                engine.StatusLog = message;
                engine.DeploymentDate = DateTime.Now;
                await this.engineProvider.SaveEngineAsync(engine).ConfigureAwait(false);

                // Create a notification for all owners
                await notificationsService.CreateNotificationsDeploymentDoneAsync("Engine deployment", message, engine, callerUserId).ConfigureAwait(false);

                // Send only to user with deployment on its windows
                await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deployed, engine, $"Deployment done.", callerUserId).ConfigureAwait(false);

            }
            catch (Exception ex)
            {
                await ThrowAndNotifyErrorAsync(engine, ex.Message, callerUserId).ConfigureAwait(false);
            }

        }


        public async Task DeleteEngineDeploymentAsync(YEngine engine, Guid? callerUserId = default, CancellationToken token = default)
        {
            try
            {
                await this.engineProvider.DeleteEngineAsync(engine.Id).ConfigureAwait(false);

                if (!string.IsNullOrEmpty(engine.ResourceGroupName))
                {
                    var checkResourceGroupResponse = await this.clientResource.GetAsync(engine.ResourceGroupName, ApiVersion).ConfigureAwait(false);

                    // Check if resource group is deployed
                    if (checkResourceGroupResponse.StatusCode == HttpStatusCode.NotFound)
                    {
                        await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Droping, engine,
                            $"Resource group {engine.ResourceGroupName} is already dropped or does not exists.", callerUserId).ConfigureAwait(false);
                    }
                    else
                    {
                        var resourceResponse = await this.clientResource.DeleteAsync(engine.ResourceGroupName, ApiVersion, token).ConfigureAwait(false);

                        var updateUri = resourceResponse.UpdateUri;

                        var r = await this.clientResource.UpdateStatusAsync(updateUri, token).ConfigureAwait(false);

                        var deletionStatusCode = r.StatusCode;

                        // wait for cluster to be deployed
                        while (deletionStatusCode != HttpStatusCode.OK)
                        {
                            await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Droping, engine,
                                  $"Resource group {engine.ResourceGroupName} is droping...", callerUserId).ConfigureAwait(false);

                            await Task.Delay(10000).ConfigureAwait(false);

                            r = await this.clientResource.UpdateStatusAsync(updateUri, token).ConfigureAwait(false);

                            deletionStatusCode = r.StatusCode;

                            if (deletionStatusCode == HttpStatusCode.BadRequest)
                            {
                                await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Error, engine,
                                        $"Failed to delete resource group {engine.ResourceGroupName}.", callerUserId, r.Value).ConfigureAwait(false);

                                return;
                            }

                        }
                    }
                }

                var message = $"Drop of your engine <strong>{engine.EngineName}</strong> is done.";
                // Create a notification for all owners
                await notificationsService.CreateNotificationsDeploymentDoneAsync("Engine deployment", message, engine, callerUserId).ConfigureAwait(false);
                // Send only to user with deployment on its windows
                await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Dropped, engine, message, callerUserId).ConfigureAwait(false);

            }
            catch (Exception ex)
            {
                await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Error, engine, ex.Message, callerUserId).ConfigureAwait(false);

            }

        }

        private async Task<YResource> CreateResourceGroupAsync(YEngine engine, Guid? callerUserId = default, CancellationToken token = default)
        {
            var resourceResponse = await this.clientResource.GetAsync(engine.ResourceGroupName, ApiVersion).ConfigureAwait(false);

            // Check if resource group is deployed
            if (resourceResponse.StatusCode == HttpStatusCode.NotFound)
            {
                // Check if resource groupe name is authorized
                var check = await this.clientResource.CheckResourceNameIsValidAsync(engine.ResourceGroupName, "Microsoft.Resources/subscriptions/resourcegroups").ConfigureAwait(false);

                if (check.Value.Status != "Allowed")
                {
                    var message = $"Name {engine.ResourceGroupName} is not allowed";
                    await ThrowAndNotifyErrorAsync(engine, message, callerUserId).ConfigureAwait(false);
                }

                var resourceRequest = new YResource
                {
                    Location = engine.Location,
                    Tags = engine.Tags
                };

                resourceResponse = await this.clientResource.CreateOrUpdateAsync(engine.ResourceGroupName, ApiVersion, resourceRequest).ConfigureAwait(false);
                var provisioningState = resourceResponse.Value.Properties["provisioningState"].ToString();

                if (provisioningState == "Failed")
                {
                    var message = $"Failed to create resource group {engine.ResourceGroupName}";
                    await ThrowAndNotifyErrorAsync(engine, message, callerUserId).ConfigureAwait(false);
                }

                if (provisioningState == "Succeeded")
                {
                    await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
                        $"Resource group {engine.ResourceGroupName} created.", callerUserId,
                        resourceResponse.Value).ConfigureAwait(false);
                }
                else
                {
                    var message = $"Unable to create {engine.ResourceGroupName}";
                    await ThrowAndNotifyErrorAsync(engine, message, callerUserId).ConfigureAwait(false);
                }

                return resourceResponse.Value;
            }
            else
            {
                await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
                    $"Resource group {engine.ResourceGroupName} already created.", callerUserId, resourceResponse.Value).ConfigureAwait(false);

                return resourceResponse.Value;
            }
        }

        private async Task<YResource> CreateDataFactoryAsync(YEngine engine, Guid? callerUserId = default, CancellationToken token = default)
        {
            var factoryResourceResponse = await this.clientResource.GetAsync
                        (engine.ResourceGroupName, "Microsoft.DataFactory", "", "factories", engine.FactoryName, DataFactoryApiVersion).ConfigureAwait(false);

            // check if factory is deployed
            if (factoryResourceResponse.StatusCode == HttpStatusCode.NotFound)
            {

                // Create Databricks payload
                var factoryResourceRequest = new YResource
                {
                    Location = engine.Location,
                    Properties = new Dictionary<string, object>()
                };

                factoryResourceResponse = await this.clientResource.StartCreateOrUpdateAsync
                    (engine.ResourceGroupName, "Microsoft.DataFactory", "", "factories", engine.FactoryName, DataFactoryApiVersion, factoryResourceRequest).ConfigureAwait(false);

                var factoryProvisioningState = factoryResourceResponse.Value.Properties["provisioningState"].ToString();

                if (factoryProvisioningState == "Accepted")
                {
                    await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
                            $"Data factory {engine.FactoryName} created. Deploying in progress...", callerUserId).ConfigureAwait(false);
                }

                // wait for cluster to be deployed
                while (factoryProvisioningState != "Succeeded")
                {
                    await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
                      $"Deploying data factory {engine.FactoryName}...", callerUserId).ConfigureAwait(false);

                    await Task.Delay(10000).ConfigureAwait(false);

                    factoryResourceResponse = await this.clientResource.GetAsync
                        (engine.ResourceGroupName, "Microsoft.DataFactory", "", "factories", engine.FactoryName, DataFactoryApiVersion).ConfigureAwait(false);

                    factoryProvisioningState = factoryResourceResponse.Value.Properties["provisioningState"].ToString();

                    if (factoryProvisioningState == "Failed")
                    {
                        var message = $"Failed to create data factory {engine.FactoryName}.";
                        await ThrowAndNotifyErrorAsync(engine, message, callerUserId).ConfigureAwait(false);
                    }


                }

                if (factoryProvisioningState == "Succeeded")
                {

                    await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
                            $"Data factory {engine.FactoryName} deployed.", callerUserId,
                                factoryResourceResponse.Value).ConfigureAwait(false);

                    return factoryResourceResponse.Value;
                }
                else
                {
                    var message = $"Failed to create data factory {engine.FactoryName}.";
                    await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Error, engine, message, callerUserId, factoryResourceResponse.Value).ConfigureAwait(false);
                    engine.Status = YEngineStatus.Failed;
                    engine.StatusLog = message;
                    await this.engineProvider.SaveEngineAsync(engine).ConfigureAwait(false);
                    throw new Exception(message);

                }
            }
            else
            {
                await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
                        $"Data factory {engine.FactoryName} already deployed.", callerUserId, factoryResourceResponse.Value).ConfigureAwait(false);

                return factoryResourceResponse.Value;
            }
        }


        private async Task<JObject> CreateDataFactoryDatabricksLinkedService(YEngine engine,
            YDatabricksCluster dbricks, YResource workspace, Guid? callerUserId = default)
        {
            var pathUri = $"/subscriptions/{options.SubscriptionId}/resourceGroups/{engine.ResourceGroupName}/" +
                          $"providers/Microsoft.DataFactory/factories/{engine.FactoryName}/linkedservices/" +
                          $"LS_{engine.ClusterName}";

            var query = $"api-version={DataFactoryApiVersion}";

            var databricksWorkspaceUrl = $"https://{workspace.Properties["workspaceUrl"]}";

            // Get Databricks token
            var tokenSecret = await keyVaultsController.GetKeyVaultSecret(engine.Id, engine.ClusterName);

            string token = tokenSecret?.Value;

            var typeProperties = new JObject
                {
                    { "properties", new JObject {
                        { "type", "AzureDatabricks" },
                        { "description", "Databricks Linked Service, created during deployment" },
                        { "typeProperties", new JObject {
                            { "domain", databricksWorkspaceUrl },
                            { "accessToken", new JObject
                                {
                                    { "type", "SecureString" },
                                    { "value", token }
                                }
                            },
                            { "existingClusterId", dbricks.ClusterId }
                        }
                    }}},
                };

            // Get the response. we may want to create a real class for this result ?
            var dbricksTokenResponse = await this.client.ProcessRequestManagementAsync<JObject>(
                pathUri, query, typeProperties, HttpMethod.Put).ConfigureAwait(false);

            await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
                $"Data factory {engine.FactoryName}. Linked Service for Databricicks LS_{engine.ClusterName} created.", callerUserId).ConfigureAwait(false);

            return dbricksTokenResponse.Value;


        }

        private async Task<JObject> CreateDataFactoryStorageLinkedService(YEngine engine,
       YDatabricksCluster dbricks, YResource storageResource, Guid? callerUserId = default)
        {

            // get keys

            var pathStorageKeysUri = $"/subscriptions/{options.SubscriptionId}/resourceGroups/{engine.ResourceGroupName}/" +
                          $"providers/Microsoft.Storage/storageAccounts/{engine.StorageName}/listKeys";

            var queryStorageKey = $"api-version={StorageApiVersion}&expand=kerb";

            // Get the response. we may want to create a real class for this result ?
            var storageKeyResponse = await this.client.ProcessRequestManagementAsync<JObject>(
                pathStorageKeysUri, queryStorageKey, null, HttpMethod.Post).ConfigureAwait(false);


            var pathUri = $"/subscriptions/{options.SubscriptionId}/resourceGroups/{engine.ResourceGroupName}/" +
                          $"providers/Microsoft.DataFactory/factories/{engine.FactoryName}/linkedservices/" +
                          $"LS_{engine.StorageName}";

            var query = $"api-version={DataFactoryApiVersion}";

            var storageAccountName = storageResource.Name;
            var storageAccountKey = storageKeyResponse.Value["keys"][0]["value"].ToString();

            var storageDataSource = new YDataSourceAzureBlobFS();
            storageDataSource.Description = "Storage Linked Service, created during deployment";
            storageDataSource.Name = $"LS_{engine.StorageName}";
            storageDataSource.StorageAccountKey = storageAccountKey;
            storageDataSource.StorageAccountName = storageAccountName;

            // Get the response. we may want to create a real class for this result ?
            var storageLinkResponse = await this.client.ProcessRequestManagementAsync<JObject>(
                pathUri, query, storageDataSource, HttpMethod.Put).ConfigureAwait(false);

            await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
                $"Data factory {engine.FactoryName}. Linked Service for Azure Data Lake Gen 2 LS_{engine.StorageName} created.", callerUserId).ConfigureAwait(false);

            return storageLinkResponse.Value;


        }


        private async Task<YResource> CreateDatabricksWorkspaceAsync(YEngine engine, Guid? callerUserId = default, CancellationToken token = default)
        {
            var dbricksResourceResponse = await this.clientResource.GetAsync
                    (engine.ResourceGroupName, "Microsoft.Databricks", "", "workspaces", engine.ClusterName, DataBricksApiVersion).ConfigureAwait(false);

            // check if databricks or synapse is deployed
            if (dbricksResourceResponse.StatusCode == HttpStatusCode.NotFound)
            {
                var managedResourceGroupId = $"dataBricks-{engine.ResourceGroupName}";

                if (managedResourceGroupId == engine.ResourceGroupName)
                {
                    var message = $"The managed resource group can not have the same name as resource group name";
                    await ThrowAndNotifyErrorAsync(engine, message, callerUserId).ConfigureAwait(false);
                }

                // Create Databricks payload
                var dbricksResourceRequest = new YResource
                {
                    Location = engine.Location,
                    Properties = new Dictionary<string, object>()
                        {
                            { "managedResourceGroupId", $"/subscriptions/{this.options.SubscriptionId}/resourceGroups/{managedResourceGroupId}" }
                        }
                };

                dbricksResourceResponse = await this.clientResource.StartCreateOrUpdateAsync
                    (engine.ResourceGroupName, "Microsoft.Databricks", "", "workspaces", engine.ClusterName, DataBricksApiVersion, dbricksResourceRequest).ConfigureAwait(false);

                var dbricksProvisioningState = dbricksResourceResponse.Value.Properties["provisioningState"].ToString();

                if (dbricksProvisioningState == "Accepted")
                {
                    await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
                            $"Databricks cluster {engine.ClusterName} created. Deploying in progress...", callerUserId).ConfigureAwait(false);
                }
                else
                {
                    var message = $"Failed to create cluster {engine.ClusterName}.";
                    await ThrowAndNotifyErrorAsync(engine, message, callerUserId).ConfigureAwait(false);
                };

                // wait for cluster to be deployed
                while (dbricksProvisioningState != "Succeeded")
                {
                    await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
                            $"Deploying Databricks cluster {engine.ClusterName}...", callerUserId).ConfigureAwait(false);

                    await Task.Delay(10000).ConfigureAwait(false);

                    dbricksResourceResponse = await this.clientResource.GetAsync
                        (engine.ResourceGroupName, "Microsoft.Databricks", "", "workspaces", engine.ClusterName, DataBricksApiVersion).ConfigureAwait(false);

                    dbricksProvisioningState = dbricksResourceResponse.Value.Properties["provisioningState"].ToString();

                    if (dbricksProvisioningState == "Failed")
                    {
                        var message = $"Failed to create cluster {engine.ClusterName}.";
                        await ThrowAndNotifyErrorAsync(engine, message, callerUserId).ConfigureAwait(false);
                    }

                }

                if (dbricksProvisioningState == "Succeeded")
                {

                    await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
                            $"Databricks cluster {engine.ClusterName} deployed.", callerUserId,
                                dbricksResourceResponse.Value).ConfigureAwait(false);

                    return dbricksResourceResponse.Value;
                }
                else
                {
                    var message = $"Failed to create cluster {engine.ClusterName}.";
                    await ThrowAndNotifyErrorAsync(engine, message, callerUserId).ConfigureAwait(false);
                };
            }
            else
            {
                var dbricks = dbricksResourceResponse.Value;

                if (dbricks.Properties != null && dbricks.Properties.ContainsKey("provisioningState"))
                {
                    var state = dbricks.Properties["provisioningState"].ToString();

                    if (state == "Failed")
                    {
                        var message = "The databricks cluster is in <strong>Failed</strong> provision state.";
                        await ThrowAndNotifyErrorAsync(engine, message, callerUserId).ConfigureAwait(false);
                    }
                }

                await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
                        $"Databricks cluster {engine.ClusterName} already deployed.", callerUserId, dbricksResourceResponse.Value).ConfigureAwait(false);

                return dbricksResourceResponse.Value;
            }

            return null;
        }


        public async Task<YResource> CreateStorageAsync(YEngine engine, Guid? callerUserId = default, CancellationToken token = default)
        {
            var storageResourceResponse = await this.clientResource.GetAsync
                    (engine.ResourceGroupName, "Microsoft.Storage", "", "storageAccounts", engine.StorageName, StorageApiVersion).ConfigureAwait(false);

            // check if Storage is deployed
            if (storageResourceResponse.StatusCode == HttpStatusCode.NotFound)
            {
                // Create Azure Key Vault payload
                var resourceRequest = new YResource
                {
                    Location = engine.Location,
                    Sku = new YSku { Name = "Standard_GRS" },
                    Kind = "StorageV2",
                    Properties = new Dictionary<string, object>
                    {
                        {"isHnsEnabled" , true },
                        {"accessTier", "Hot" },

                    }
                };

                var resourceResponse = await this.clientResource.StartCreateOrUpdateAsync
                    (engine.ResourceGroupName, "Microsoft.Storage", "", "storageAccounts", engine.StorageName, StorageApiVersion, resourceRequest);

                var storageProvisioningState = "";

                // wait for cluster to be deployed
                while (storageProvisioningState != "Succeeded")
                {
                    await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
                            $"Deploying Storage {engine.StorageName}...", callerUserId).ConfigureAwait(false);

                    await Task.Delay(5000).ConfigureAwait(false);

                    resourceResponse = await this.clientResource.GetAsync
                        (engine.ResourceGroupName, "Microsoft.Storage", "", "storageAccounts", engine.StorageName, StorageApiVersion).ConfigureAwait(false);

                    storageProvisioningState = resourceResponse.Value.Properties["provisioningState"].ToString();

                    if (storageProvisioningState == "Failed")
                    {
                        var message = $"Failed to deploy storage {engine.StorageName}.";
                        await ThrowAndNotifyErrorAsync(engine, message, callerUserId).ConfigureAwait(false);
                    }

                    await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
                            $"Deploying Storage {engine.StorageName}...", callerUserId).ConfigureAwait(false);

                }

                await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
                            $"Storage {engine.StorageName} deployed.", callerUserId, resourceResponse.Value).ConfigureAwait(false);

                return resourceResponse.Value;

            }
            else
            {
                await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
                            $"Storage {engine.StorageName} already deployed.", callerUserId, storageResourceResponse.Value).ConfigureAwait(false);

                return storageResourceResponse.Value;

            }
        }

        private async Task<YResource> CreateAzureKeyVaultAsync(YEngine engine, Guid? callerUserId = default, CancellationToken token = default)
        {
            var keyVaultResourceResponse = await this.clientResource.GetAsync
                         (engine.ResourceGroupName, "Microsoft.KeyVault", "", "vaults", engine.KeyVaultName, KeyVaultApiVersion).ConfigureAwait(false);

            // check if Keyvault is deployed
            if (keyVaultResourceResponse.StatusCode == HttpStatusCode.NotFound)
            {

                // Create Databricks payload
                var keyVaultResourceRequest = new YResource
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


                keyVaultResourceResponse = await this.clientResource.StartCreateOrUpdateAsync
                    (engine.ResourceGroupName, "Microsoft.KeyVault", "", "vaults", engine.KeyVaultName, KeyVaultApiVersion, keyVaultResourceRequest).ConfigureAwait(false);

                var keyVaultProvisioningState = keyVaultResourceResponse.Value.Properties["provisioningState"].ToString();

                if (keyVaultProvisioningState == "Accepted")
                {
                    await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
                            $"Keyvault {engine.KeyVaultName} created. Deploying in progress...", callerUserId).ConfigureAwait(false);
                }

                // wait for cluster to be deployed
                while (keyVaultProvisioningState != "Succeeded")
                {
                    await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
                         $"Deploying Keyvault {engine.KeyVaultName}...", callerUserId).ConfigureAwait(false);
        
                    await Task.Delay(10000).ConfigureAwait(false);

                    keyVaultResourceResponse = await this.clientResource.GetAsync
                        (engine.ResourceGroupName, "Microsoft.KeyVault", "", "vaults", engine.KeyVaultName, KeyVaultApiVersion).ConfigureAwait(false);

                    keyVaultProvisioningState = keyVaultResourceResponse.Value.Properties["provisioningState"].ToString();

                    if (keyVaultProvisioningState == "Failed")
                    {
                        var message = $"Failed to create Keyvault {engine.KeyVaultName}.";
                        await ThrowAndNotifyErrorAsync(engine, message, callerUserId).ConfigureAwait(false);
                    }


                }

                if (keyVaultProvisioningState == "Succeeded")
                {

                    await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
                            $"Keyvault {engine.KeyVaultName} deployed.", callerUserId,
                                keyVaultResourceResponse.Value).ConfigureAwait(false);

                    return keyVaultResourceResponse.Value;
                }
                else
                {
                    var message = $"Failed to create Keyvault {engine.KeyVaultName}.";
                    await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Error, engine, message, callerUserId, keyVaultResourceResponse.Value).ConfigureAwait(false);
                    engine.Status = YEngineStatus.Failed;
                    engine.StatusLog = message;
                    await this.engineProvider.SaveEngineAsync(engine).ConfigureAwait(false);
                    throw new Exception(message);

                }
            }
            else
            {
                await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
                        $"Keyvault {engine.KeyVaultName} already deployed.", callerUserId, keyVaultResourceResponse.Value).ConfigureAwait(false);

                return keyVaultResourceResponse.Value;
            }
        }


        private async Task<YDatabricksCluster> CreateDatabricksClusterAsync(YEngine engine, YResource workspace, Guid? callerUserId = default, CancellationToken cancellationToken = default)
        {

            var dbricksResourceId = workspace.Id;

            if (!workspace.Properties.ContainsKey("workspaceUrl"))
                throw new Exception("Can't get the workspace url");

            var dbricksWorkspaceName = workspace.Properties["workspaceUrl"];

            // Url for creating a cluster
            var dbricksUriBuilder = new UriBuilder($"https://{dbricksWorkspaceName}")
            {
                Path = "api/2.0/token/create"
            };

            var dbricksWorkspaceUrl = dbricksUriBuilder.Uri;

            // Get connection string
            var tokenSecret = await keyVaultsController.GetKeyVaultSecret(engine.Id, engine.ClusterName);

            string token = tokenSecret?.Value;

            if (tokenSecret == null)
            {
                // the double // before .default IS IMPORTANT
                var mgtToken = await this.authProvider.GetAccessTokenForAsync("https://management.core.windows.net//.default").ConfigureAwait(false);
                // this GUID is the Databricks Worskspace resource Id
                var dbricksWorkspaceToken = await this.authProvider.GetAccessTokenForAsync("2ff814a6-3304-4ab8-85cb-cd0e6f879c1d/.default").ConfigureAwait(false);

                // Build the request
                Dictionary<string, string> headers = new Dictionary<string, string>();
                headers.Add("X-Databricks-Azure-SP-Management-Token", mgtToken);
                headers.Add("X-Databricks-Azure-Workspace-Resource-Id", dbricksResourceId);

                var jsonData = new JObject { { "comment", $"Terraform-generated token from engine {engine.EngineName}" } };

                // Get the response. we may want to create a real class for this result ?
                var dbricksTokenResponse = await this.client.ProcessRequestAsync<JObject>(dbricksWorkspaceUrl, jsonData, HttpMethod.Post, dbricksWorkspaceToken, headers).ConfigureAwait(false);

                if (dbricksTokenResponse == null || dbricksTokenResponse.StatusCode != HttpStatusCode.OK || dbricksTokenResponse.Value == null || !dbricksTokenResponse.Value.ContainsKey("token_value"))
                {
                    var message = $"Unable to generate a databricks Token in Databricks workspace {engine.ClusterName}";
                    await ThrowAndNotifyErrorAsync(engine, message, callerUserId).ConfigureAwait(false);
                }

                token = dbricksTokenResponse.Value["token_value"].ToString();

                await keyVaultsController.SetKeyVaultSecret(engine.Id, engine.ClusterName,
                    new YKeyVaultSecretPayload { Key = engine.ClusterName, Value = token });

                await this.engineProvider.SaveEngineAsync(engine).ConfigureAwait(false);

                await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
                    $"Databricks cluster {engine.ClusterName} token created. ", callerUserId).ConfigureAwait(false);
            }

            dbricksUriBuilder.Path = "api/2.0/clusters/list";
            dbricksWorkspaceUrl = dbricksUriBuilder.Uri;

            // Get all the dbricks cluster already created
            var dbricksClustersResponse = await this.client.ProcessRequestAsync<YDatabricksClusters>(dbricksWorkspaceUrl, null, HttpMethod.Get, token).ConfigureAwait(false);

            if (dbricksClustersResponse == null || dbricksClustersResponse.StatusCode != HttpStatusCode.OK || dbricksClustersResponse.Value == null)
            {
                var message = $"Unable to get the clusters list from Databricks workspace {engine.ClusterName}";
                await ThrowAndNotifyErrorAsync(engine, message, callerUserId).ConfigureAwait(false);
            }

            var clusterList = dbricksClustersResponse.Value;
            var clusterId = string.Empty;

            await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
                $"Getting clusters list from Databricks workspace {engine.ClusterName}", callerUserId).ConfigureAwait(false);

            if (clusterList?.Clusters == null || !clusterList.Clusters.Any(c => c.ClusterName == engine.ClusterName))
            {
                var cluster = new YDatabricksCluster
                {
                    Autoscale = new Autoscale
                    {
                        MinWorkers = 2,
                        MaxWorkers = 8
                    },
                    ClusterName = engine.ClusterName,
                    SparkVersion = "7.3.x-scala2.12",
                    SparkConf = new Dictionary<string, string>
                    {
                        { "spark.databricks.delta.preview.enabled", "true" },
                        { "spark.databricks.delta.optimizeWrite.enabled", "true" }
                    },
                    NodeTypeId = "Standard_DS3_v2",
                    SparkEnvVars = new Dictionary<string, string>
                    {
                        { "PYSPARK_PYTHON", "/databricks/python3/bin/python3" }
                    },
                    AutoterminationMinutes = 120
                };

                dbricksUriBuilder.Path = "api/2.0/clusters/create";
                dbricksWorkspaceUrl = dbricksUriBuilder.Uri;

                var clusterCreationResponse = await this.client.ProcessRequestAsync<JObject>(dbricksWorkspaceUrl, cluster, HttpMethod.Post, token).ConfigureAwait(false);

                if (clusterCreationResponse == null || clusterCreationResponse.StatusCode != HttpStatusCode.OK || clusterCreationResponse.Value == null)
                {
                    var message = $"Unable to create cluster {engine.ClusterName} into Databricks workspace {engine.ClusterName}";
                    await ThrowAndNotifyErrorAsync(engine, message, callerUserId).ConfigureAwait(false);
                }

                var clusterCreated = clusterCreationResponse.Value.ToObject<YDatabricksCluster>();
                clusterId = clusterCreated.ClusterId;

                await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
                    $"Cluster {clusterId} created in Databricks workspace {engine.ClusterName}", callerUserId, clusterCreated).ConfigureAwait(false);

            }
            else
            {
                var cluster = clusterList.Clusters.First(c => c.ClusterName == engine.ClusterName);
                clusterId = cluster.ClusterId;
            }


            dbricksUriBuilder.Path = "api/2.0/clusters/get";
            dbricksUriBuilder.Query = $"cluster_id={clusterId}";
            dbricksWorkspaceUrl = dbricksUriBuilder.Uri;

            var clusterStateResponse = await this.client.ProcessRequestAsync<YDatabricksCluster>(dbricksWorkspaceUrl, null, HttpMethod.Get, token).ConfigureAwait(false);

            if (clusterStateResponse == null || clusterStateResponse.StatusCode != HttpStatusCode.OK || clusterStateResponse.Value == null)
            {
                var message = $"Unable to get cluster {engine.ClusterName} from Databricks workspace {engine.ClusterName}";
                await ThrowAndNotifyErrorAsync(engine, message, callerUserId).ConfigureAwait(false);
            }

            var clusterState = clusterStateResponse.Value;

            while (clusterState.State == "PENDING")
            {
                await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
                    $"Cluster {clusterId}. {clusterState.StateMessage}", callerUserId).ConfigureAwait(false);

                await Task.Delay(10000).ConfigureAwait(false);

                clusterStateResponse = await this.client.ProcessRequestAsync<YDatabricksCluster>(dbricksWorkspaceUrl, null, HttpMethod.Get, token).ConfigureAwait(false);
                clusterState = clusterStateResponse.Value;
            }

            if (clusterState.State != "RUNNING" && clusterState.State != "TERMINATED")
            {
                var message = $"Unable to start cluster {engine.ClusterName} from Databricks workspace {engine.ClusterName}";
                await ThrowAndNotifyErrorAsync(engine, message, callerUserId).ConfigureAwait(false);
            }

            // Get the last cluster details to send back to the notification service
            clusterStateResponse = await this.client.ProcessRequestAsync<YDatabricksCluster>(dbricksWorkspaceUrl, null, HttpMethod.Get, token).ConfigureAwait(false);
            clusterState = clusterStateResponse.Value;

            await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Deploying, engine,
               $"Cluster {clusterId} running in Databricks workspace {engine.ClusterName}", callerUserId, clusterState).ConfigureAwait(false);


            return clusterStateResponse.Value;

        }

        public async Task ThrowAndNotifyErrorAsync(YEngine engine, string message, Guid? callerUserId = null)
        {
            await notificationsService.SendNotificationAsync("deploy", YDeploymentStatePayloadState.Error, engine, message, callerUserId).ConfigureAwait(false);

            // Create a notification for all owners
            await notificationsService.CreateNotificationsDeploymentDoneAsync("Engine deployment", message, engine, callerUserId).ConfigureAwait(false);

            engine.Status = YEngineStatus.Failed;
            engine.StatusLog = message;
            await this.engineProvider.SaveEngineAsync(engine).ConfigureAwait(false);
            throw new Exception(message);

        }
    }




}
