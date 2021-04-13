# SETUP

A quick setup documentation on how to instal Ygdra Core Services.

> Note: **Project Y** and **Ygdra** means the same :)

## Azure Services

Basically, **Project Y** needs to run:

- One **Resource Group** that will host the Ygdra Core Services.
- Two **Azure Web App** in the previously created Resource Group:
  - First Web App will be used for the **Ygdra Web UI**.
  - Second Web App will be used to host the **Ygdra Web Api** services.
    - This Web App needs to have the `Always On` option, since we have some background services running by `HangFire`.
- One **Azure CosmosDB** database that will store some Ygdra metadatas and the `HangFire` running jobs.
  - Once create, create a new database called `Ygdra`.
  - You don't need to create any collection, since they will be created automatically by the Ygdra Core Services.
  - For Info, the two collections automatically created will be `Ygdra` and `HangFire`.
- One **Azure Signal R Service** instance that will push notifications to users and to Ygdra Core Services.
  - When creating your Azure Signal R Service, please use **Default** service mode

## Azure Service Principal

**Project Y** needs a Service Principal to access some **Azure Services**, when creating landing zones.

This Service Principal should have:

- Some specific RBAC assignements.
- Should be able to authenticate your users.
- An application **Admin** Role, to allow specific users to access the Admin section from the web ui.
- Should be able to protect our `Ygdra.Host` Web Api.

### Create the RBAC Service Principal

- Create an **RBAC Service Principal** for automation authentication.
- Then, add some specific role assignements to this SPN, needed by **Project Y**:
  - **Contributor** to be able to create Azure Resources.
  - **Key Vault Contributor** to be able to access the Project Y Key Vault.

``` bash
az ad sp create-for-rbac -n "ProjectYDemo" --role "Contributor"
{
  "appId": "XXXXX-XXXXX-XXXXX-XXXX",
  "displayName": "ProjectYDemo",
  "name": "http://ProjectYDemo",
  "password": "XXXXX-XXXXX-XXXXX-XXXX",
  "tenant": "XXXXX-XXXXX-XXXXX-XXXX"
}

az role assignment create --assignee <appId> --role "Key Vault Contributor"

# Otherwise, for an existing SPN, you can use this az role assignement command line:
# az role assignment create --assignee <appId> --role "Contributor"
# az role assignment create --assignee <appId> --role "Key Vault Contributor"

```

From the result you get, please note:

- `appId`: Will be used as `ClientID` in the appsettings.
- `password`: Will be used as `ClientSecret` in appsettings.
- `tenant`: Will be used as `TenantId` in appsettings.

We need the underlying Managed Identity Object Id, from the Service Principal.
You can get it with from this command line:

``` bash
az ad sp show --id <appId> --query objectId
AAAA-AAAA-AAAA-AAAA
```

- The output value will be used as `ClientObjectId` in the appsettings.

### Application / Web app Authentication

From the Azure Portal, go to Azure Active Directory -> App Registrations.
Choose your newly created Application (called ProjectYDemo refering the previous script in this walkthrough)
From your Application go to **Authentication** section, and add some web redirections:

> We can use the same SPN for both prod and dev. So far, each url will be submitted twice. 
One for localhost dev mode, and one for production mode.

Redirection for **Ygdra.Host**:

- https://[YgdraWebApiName].azurewebsites.net/oauth2-redirect.html
- https://localhost:44339/oauth2-redirect.html

Redirection for **Ygrdra.Web.UI**:

- https://[YgdraWebUiName].azurewebsites.net/signin-oidc
- https://localhost:44355/signin-oidc

### Web Api protection

From your Application go to **Expose an API** section, and edit the Application ID URI.
This application ID Uri should looks like:

`https://{YOURDOMAIN}.onmicrosoft.com/{CLIENT_ID}`

Then, add a new scope:

- **Scope Name**: user_impersonation
- **Who can Consent**: Admins and Users

The newly scope should looks like `https://{YOUR_DOMAIN}.onmicrosoft.com/{CLIENT_ID}/user_impersonation`

From you Application go to **Api Permissions** section, and add permissions:

- **Microsoft Graph** : User.Read, User.ReadBasic.All
- **Your API** : user_impersonation

### Create the Admin Role

From your Application, Go to **App Roles** and create a new app role:

- **Display Name**: Admin
- **Allowed members types**: Users/Groups
- **Value**: Admin (this value MUST be 'Admin' since it's used in the Ygdra code)
- **Description**: Ygdra Administrators
- **Do you want to enable this app role**: Yes

### Add your user to Admin Role

From your Application go to **Overview** section, then click on your **Managed Application in local directory**  Entreprise Application link.
You will be redirected to the Managed Identity that supports your Application.

> You should see now, from the Entreprise Application properties, the Object ID value, that we get from the `az ad sp show --id <appId> --query objectId` query, previously.

From your Entreprise Application, go to **Users and Groups** section.
Then assign your user to the **Admin** role

## Azure Web Apps Configuration

Once you have cloned the `Poject Y` repository, please add a new `appsettings.Development.json` file (and `appsettings.Production.json` when you will deploy into production)

> **Note:** These two files are part of the `.gitignore` file, and then, will not be commited to the Github repository.

Configuration for the Azure Web Api project `Ygdra.Host`:

``` json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "yourdomain.onmicrosoft.com", // Domain of your tenant. For example contoso.onmicrosoft.com
    "TenantId": "", // Tenant Id of your domain. You can find it from the Azure Active Directory Blade Overview Page
    "SubscriptionId": "", // Subscription Id where everything will be deployed. You can find it from the Azure Subcriptions Blade
    "ClientId": "", // Client Id of your Service Principal 
    "ClientObjectId": "", // Client Object Id from your Service Principal. Not the Application ID, the underline Managed Application ID !
    "ClientSecret": "", // Client Secret from your Service Principal
    "CallbackPath": "/signin-oidc"
  },
  "Graph": {
    "BaseAddress": "https://graph.microsoft.com/beta",
    "Scopes": "User.Read User.ReadBasic.All"
  },
  "YgdraServices": {
    "BaseAddress": "", // Ygdra Web Api Core Http Url. Something like "https://localhost:44339" if running locally, or something like "https://<YgdraWebApiName>.azurewebsites.net" if running from Azure
    "Scopes": "user_impersonation"
  },
  "YProvider": {
    "Provider": "YCosmosDbProvider",
    "Endpoint": "", // Ygdra Cosmos DB web url. Something like "https://<YgdraCosmosDbName>.documents.azure.com:443"
    "AccountKey": "", // CosmosDB Account Key
    "Database": "Ygdra",
    "Container": "Ygdra"
  },
  "HangFire": {
    "Endpoint": "", // HangFire will save everything on CosmosDB. Endpoint is the CosmosDB Web Url. Something like "https://<YgdraCosmosDbName>.documents.azure.com:443"
    "AccountKey": "", // Cosmos DB Account Key
    "Database": "Ygdra",
    "Container": "Hangfire"
  },
  "SignalR": {
    "ConnectionString": "" // Signal R Service Connection String. Something like "Endpoint=https://....;AccessKey=....;Version=..;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  }
}
```

Configuration for the Azure Web UI project `Ygdra.Web.UI`:

``` json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "yourdomain.onmicrosoft.com", // Domain of your tenant. For example contoso.onmicrosoft.com
    "TenantId": "", // Tenant Id of your domain. You can find it from the Azure Active Directory Blade Overview Page
    "SubscriptionId": "", // Subscription Id where everything will be deployed. You can find it from the Azure Subcriptions Blade
    "ClientId": "", // Client Id of your Service Principal 
    "ClientObjectId": "", // Client Object Id from your Service Principal
    "ClientSecret": "", // Client Secret from your Service Principal
    "CallbackPath": "/signin-oidc"
  },
  "Graph": {
    "BaseAddress": "https://graph.microsoft.com/beta",
    "Scopes": "User.Read User.ReadBasic.All"
  },
  "YgdraServices": {
    "BaseAddress": "", // Ygdra Web Api Core Http Url. Something like "https://localhost:44339" if running locally, or something like "https://<YgdraWebApiName>.azurewebsites.net" if running from Azure
    "Scopes": "user_impersonation"
  },
  "SignalR": {
    "ConnectionString": "" // Signal R Service Connection String. Something like "Endpoint=https://....;AccessKey=....;Version=..;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  }
}`
```