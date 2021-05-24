# ProjectY Quick Start

In this quick start, you will deploy the resources and configuration to get you up and running with the ProjectY Web and API for development.

> Note: **Project Y** and **Ygdra** means the same :)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free.](https://azure.microsoft.com/free/dotnet)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- [Visual Studio 2019](https://www.visualstudio.com/downloads) with the ASP.NET and web development workload.
  If you've already installed Visual Studio 2019:
  - Install the latest updates in Visual Studio by selecting **Help > Check for Updates.**
  - Add the workload by selecting **Tools > Get Tools and Features.**

## Background

**Project Y** will require the following to run:

- One **Resource Group** that will host the Ygdra Core Services.
- One **Azure Signal R Service** instance that will push notifications to users and to Ygdra Core Services.
  - When creating your Azure Signal R Service, please use **Default** service mode.
  - Using a free tier may not be sufficient since the number of messages could exceed the daily limit if you are doing lots of configurations.
- One **Azure Key Vault** instance that will hold secrets used for configuration.
- One **Azure CosmosDB** database that will store some Ygdra metadata and the `HangFire` running jobs.
  - Once the backend API (Host) is running, two databases will be created called `Ygdra` and `HangFire`.

For production, you can also choose to set up the following:

- Two **Azure Web App** in the previously created Resource Group:
  - First Web App will be used for the **Ygdra Web UI**.
  - Second Web App will be used to host the **Ygdra Web Api** services.
    - This Web App needs to have the `Always On` option, since we have some background services running by `HangFire`.

## Setup using the Azure Portal

### Azure Resource Group

1. Log in to the Azure portal and navigate to the subscription that you will be using for your deployment. In the navigation menu, select `Resource Groups` to see a list of current Resource Groups that already exist.
1. Click the `Create` link above the Resource Group list to go to the `Create a resource group` process.
    - On the **Basics** tab, verify the subscription is correct and type the desired name of your resource group. This is where all of the resources for managing your deployment will be placed.
    - Select the region closest to you. (Make sure that all of the resources required are available in the region you selected.)
    - On the **Tags** tab, if you want to, add any optional metadata for your resource group.
    - On the **Review and create** tab, verify your choices and click `Create` to create the resource group.

    [TODO: image of resource group](./)

### Azure Key Vault

1. On the list of resource groups, click the resource group you created for this deployment.
1. Click the `Add` link above the resources list and click `Marketplace` to add a resource.
    - In the `Create a resource` screen, type `Key Vault` in the search dialog.
    - In the drop down that appears, select the `Key Vault` option.
      > Note: If you press `[Enter]` in the search dialog, you will be taken to the marketplace where you will need to find the Microsoft Key Vault Azure Service.
    - On the Key Vault screen, click `Create` to start the `Create key vault` process.
    - On the **Basics** tab:
      - The "Subscription" and "Resource group" values should already be pre-filled. Verify they are correct.
      - Enter a value for the "Key Vault Name" and select the appropriate "Region".
      - The other values can be left with the defaults.
    - On the **Review + create** tab, verify your choices and click `Create` to create the Key Vault.

    [TODO: image of Key Vault](./)

### Azure Cosmos DB

1. On the list of resource groups, click the resource group you created for this deployment.
1. Click the `Add` link above the resources list and click `Marketplace` to add a resource.
    - In the `Create a resource` screen select `Azure Cosmos DB` from the list or use the search to locate "Cosmos DB"
    - On the **Basics** tab:
      - The "Subscription" and "Resource group" values should already be pre-filled. Verify they are correct.
      - Enter a value for the "Account Name", leave the API as `Core (SQL)` and select the appropriate "Location".
      - The other values can be left with the defaults.
    - On the **Review + create** tab, verify your choices and click `Create` to create the Cosmos DB Account.

    [TODO: image of Cosmos DB](./)

### Azure SignalR Service

1. On the list of resource groups, click the resource group you created for this deployment.
1. Click the `Add` link above the resources list and click `Marketplace` to add a resource.
    - In the `Create a resource` search for `SignalR` and select `SignalR Service` from the drop down.
    - On the SignalR Service screen, click `Create` to start the `SignalR` process.
    - On the **Basics** tab:
      - The "Subscription" and "Resource group" values should already be pre-filled. Verify they are correct.
      - Enter a value for the "Resource Name" and select the appropriate "Region".
      - The other values can be left with the defaults.
    - On the **Review + create** tab, verify your choices and click `Create` to create the SignalR Service.

    [TODO: image of SignalR service](./)

## Azure Service Principal

During the provisioning process, **Project Y** will use a Service Principal to access some **Azure Services**.

This Service Principal will:

- Have RBAC assignments for **Contributor** and **Key Vault Contributor** to create resources and store their secrets in the Key Vault.
- Be used to protect your `Ygdra.Host` Web API.
- Be used to authenticate your users.
- Have an application **Admin** Role, to allow specific users to access the Admin section from the web UI.

### Create the RBAC Service Principal using the Azure CLI

- Create an **RBAC Service Principal** for automation authentication.
  - The name passed in to `-n` must be unique in your tenant.

``` bash
az ad sp create-for-rbac -n "ProjectYDemo" --role "Contributor"
```

Output

``` bash
{
  "appId": "XXXXX-XXXXX-XXXXX-XXXX",
  "displayName": "ProjectYDemo",
  "name": "http://ProjectYDemo",
  "password": "XXXXX-XXXXX-XXXXX-XXXX",
  "tenant": "XXXXX-XXXXX-XXXXX-XXXX"
}
```

- Then, add some specific role assignments to this SPN, needed by **Project Y**:
  - **Contributor** to be able to create Azure Resources.
  - **Key Vault Contributor** to be able to access the Project Y Key Vault.

``` bash
az role assignment create --assignee <appId> --role "Contributor"
az role assignment create --assignee <appId> --role "Key Vault Contributor"

# Otherwise, for an existing SPN, you can use this az role assignment command line:
# az role assignment create --assignee <appId> --role "Contributor"
# az role assignment create --assignee <appId> --role "Key Vault Contributor"
```

From the results output from the CLI, make note of the following:

- `appId`: Will be used as `ClientID` in the appsettings.
- `password`: Will be used as `ClientSecret` in appsettings.
- `tenant`: Will be used as `TenantId` in appsettings.

You will also need the underlying **Managed Identity Object Id**, from the Service Principal.  
You can get it with from this command line:

``` bash
az ad sp show --id <appId> --query objectId
AAAA-AAAA-AAAA-AAAA
```

- The output value will be used as `ClientObjectId` in the appsettings.

### Application / Web app Authentication

From the Azure Portal, go to Azure Active Directory -> App Registrations.  
Choose your newly created Application (called **ProjectYDemo** referring to the previous script in this walk through).

#### Authentication

From your Application go to the **Authentication** section, and add some web re-directions:

> We can use the same SPN for both prod and dev. So far, each URL will be submitted twice.  
One for localhost dev mode, and one for production mode.

Redirection for **Ygdra.Host**:

- <https://[YgdraWebApiName].azurewebsites.net/oauth2-redirect.html>
- <https://localhost:44339/oauth2-redirect.html>

Redirection for **Ygdra.Web.UI**:

- <https://[YgdraWebUiName].azurewebsites.net/signin-oidc>
- <https://localhost:44355/signin-oidc>

#### Web API protection

From your Application go to **Expose an API** section, and edit the Application ID URI in
the gray bar. This application ID Uri should look like:

`https://{YOURDOMAIN}.onmicrosoft.com/{CLIENT_ID}`

Then, confirm the new scope:

- **Scope Name**: user_impersonation
- **Who can Consent**: Admins and Users

The new scope should look like `https://{YOUR_DOMAIN}.onmicrosoft.com/{CLIENT_ID}/user_impersonation`

From your Application go to the **API Permissions** section, and add permissions:

- Under Microsoft APIs: **Microsoft Graph** : Delegated permissions : User.Read, User.ReadBasic.All
- Under My APIs: **Your Application Name** : Delegated permissions : user_impersonation

#### Create the Admin Role

From your Application, Go to **App Roles** and create a new app role:

- **Display Name**: Admin
- **Allowed members types**: Users/Groups
- **Value**: Admin (this value MUST be 'Admin' since it's used in the Ygdra code)
- **Description**: Ygdra Administrators
- **Do you want to enable this app role**: Yes

### Add your user to Admin Role

Refresh your browser window to refresh the cached roles.

From your Application go to the **Overview** section, then click on your **Managed Application in local directory**  Enterprise Application link.  
You will be redirected to the Managed Identity that supports your Application.

> You should see now, from the Enterprise Application properties, the Object ID value, that we get from the `az ad sp show --id <appId> --query objectId` query.

From your Enterprise Application, go to **Users and Groups** section.
Then assign your user to the **Admin** role.

## Azure Web Apps Configuration

Once you have cloned the [ProjectY repository](https://github.com/Mimetis/ProjectY), please add a new `appsettings.Development.json` file (and `appsettings.Production.json` when you will deploy into production).

> **Note:** These two files are part of the `.gitignore` file, and then, will not be committed to the Github repository.

Configuration for the Azure Web API project `Ygdra.Host`:

``` jsonc
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "yourdomain.onmicrosoft.com", // Domain of your tenant. For example contoso.onmicrosoft.com
    "TenantId": "", // Tenant Id of your domain. You can find it from the Azure Active Directory Blade Overview Page
    "SubscriptionId": "", // Subscription Id where everything will be deployed. You can find it from the Azure Subscriptions Blade
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

``` jsonc
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "yourdomain.onmicrosoft.com", // Domain of your tenant. For example contoso.onmicrosoft.com
    "TenantId": "", // Tenant Id of your domain. You can find it from the Azure Active Directory Blade Overview Page
    "SubscriptionId": "", // Subscription Id where everything will be deployed. You can find it from the Azure Subscriptions Blade
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
}
```

## Start the Application in Debug Mode

This will run the ProjectY solution in debug mode on your local machine. Because Databricks needs to be able to call the Ygdra Web API, we are using [ngrok](https://ngrok.com/) to provide an http tunnel to your local machine.

1. Download and unzip ngrok from [here](https://dashboard.ngrok.com/get-started/setup).
1. From a command prompt in the ngrok folder, run the following:

    ```bat
    ngrok http https://localhost:5001
    ```

1. Copy the Forwarding https url (i.e. `https://0509cc619166.ngrok.io` to paste into the appsettings.Development.json file).
1. Open the `ProjectY/Ygdra.sln`  in Visual Studio 2019.
1. Edit **Ygdra.Web.UI/appsettings.Development.json** file to update the BaseAddress for YgdraServices with the ngrok url.
1. In the toolbar, select the **Ygdra.Web.UI** project from the "Startup Projects" dropdown and replace **IIS Express** with **Ygdra.Web.UI** if necessary.
1. Edit **Ygdra.Host/appsettings.Development.json** file to update the BaseAddress for YgdraServices with the ngrok url.
1. In the toolbar, select the **Ygdra.Host** project from the "Startup Projects" dropdown and replace **IIS Express** with **Ygdra.Host** if necessary.
1. In the Solution Explorer, right click the **Ygdra** Solution and click "Properties".
    - Under the "Common Properties" select the "Startup Project".
    - On the right, Choose "Multiple Startup Projects" and set **Ygdra.Host** and **Ygdra.Web.UI** to "Start".
    - Click "OK" to close the Solution Properties.
1. Start the running/debugging process by pressing "F5" or the green debug button in the toolbar.
