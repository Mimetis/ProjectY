#!/bin/bash
export PREFIX=ygdra
export SUFFIX=aioup

export RG_NAME=rg
export LOCATION=westeurope

export SERVICE_PRINCIPAL_NAME=sp
export WEB_UI_NAME=web 
export WEB_UI_LOCAL_NAME="localhost:44355"

export WEB_API_NAME=api
export WEB_API_LOCAL_NAME="localhost:44339"

export COSMOSDB_NAME=cosmos
export SIGNALR_SERVICES_NAME=signalr
export APP_SERVICE_PLAN=plan
export PURVIEW_NAME=purview
export KV_NAME=kv

export DOMAIN=microsoft.onmicrosoft.com

while getopts 'p:s:r:l:d:' OPTION; do
    case "$OPTION" in
        p)
            PREFIX="$OPTARG"
            printf "%b\n" "\e[31m->\e[0m Option Prefix is given:\e[31m$PREFIX\e[0m"
            ;;
        s)
            SUFFIX="$OPTARG"
            printf "%b\n" "\e[31m->\e[0m Option Suffix is given:\e[31m$SUFFIX\e[0m"
            ;;
        r)
            RG_NAME="$OPTARG"
            printf "%b\n" "\e[31m->\e[0m Option Resource Group Name is given:\e[31m$RG_NAME\e[0m"
            ;;
        l)
            LOCATION="$OPTARG"
            printf "%b\n" "\e[31m->\e[0m Option Location is given: \e[31m$LOCATION\e[0m"
            ;;
        d)
            DOMAIN="$OPTARG"
            printf "%b\n" "\e[31m->\e[0m Option Domain is given: \e[31m$DOMAIN\e[0m"
            ;;
        *)
            exit 1
        ;;
    esac
done


RG_NAME="$PREFIX$RG_NAME$SUFFIX"
WEB_UI_NAME="$PREFIX$WEB_UI_NAME$SUFFIX"
WEB_API_NAME="$PREFIX$WEB_API_NAME$SUFFIX"
COSMOSDB_NAME="$PREFIX$COSMOSDB_NAME$SUFFIX"
SIGNALR_SERVICES_NAME="$PREFIX$SIGNALR_SERVICES_NAME$SUFFIX"
APP_SERVICE_PLAN="$PREFIX$APP_SERVICE_PLAN$SUFFIX"
SERVICE_PRINCIPAL_NAME="$PREFIX$SERVICE_PRINCIPAL_NAME$SUFFIX"
PURVIEW_NAME="$PREFIX$PURVIEW_NAME$SUFFIX"
KV_NAME="$PREFIX$KV_NAME$SUFFIX"


# Check if jq is installed
if ! type "jq" > /dev/null; then
    echo "please install jq (sudo apt-get update && sudo apt-get upgrade && sudo apt-get install jq)"
    exit 3
fi

# Check if az is installed
if ! type "az" > /dev/null; then
    echo "please install az (curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash)"
    exit 3
fi


az_login() {
    if [ "x$ARM_SUBSCRIPTION_ID" != "x" ] && [ "x$ARM_TENANT_ID" != "x" ] && [ "x$ARM_CLIENT_ID" != "x" ] && [ "x$ARM_CLIENT_SECRET" != "x" ]; then
        printf "%b\n" "\e[31mlog in using ARM env vars.\e[0m"
        az login --service-principal -u $ARM_CLIENT_ID -p $ARM_CLIENT_SECRET --tenant $ARM_TENANT_ID
        az account set -s $ARM_SUBSCRIPTION_ID
    fi
}

az_login

IdentifierUri="https://${DOMAIN}"
HomePage="http://${SERVICE_PRINCIPAL_NAME}"
ReturnUris="https://login.microsoftonline.com/common/oauth2/nativeclient https://${WEB_UI_NAME}.azurewebsites.net/signin-oidc https://${WEB_UI_LOCAL_NAME}/signin-oidc https://${WEB_UI_LOCAL_NAME}/swagger/oauth2-redirect.html https://${WEB_API_NAME}.azurewebsites.net/oauth2-redirect.html https://${WEB_API_LOCAL_NAME}/oauth2-redirect.html"

printf "%b\n" "## Getting Tenant and Subscription"
tenant_id=$(az account show | jq -r '.tenantId')
subscription_id=$(az account show | jq -r '.id')
currentPrincipalId=$(az ad signed-in-user show --query objectId -o tsv)
printf "%b\n" "   TenantId:\e[32m${tenant_id}\e[0m"
printf "%b\n" "   SubscriptionId:\e[32m${subscription_id}\e[0m"

printf "%b\n" "## Checking Resource Group \e[32m$RG_NAME\e[0m."
rg_exists=$(az group exists -n $RG_NAME)

if [ "$rg_exists" == "false" ]; then 
    printf "%b\n" "   Creating Resource Group \e[32m$RG_NAME\e[0m."
    rg_created=$(az group create --name $RG_NAME --location $LOCATION)
    rg_created_provisioning_state=$(echo $rg_created | jq -r '.properties.provisioningState')
    printf "%b\n" "   Resource Group \e[32m$RG_NAME\e[0m created."
    printf "%b\n" "   Provisioning State:\e[32m$rg_created_provisioning_state\e[0m."

else
    printf "%b\n" "   Resource Group \e[32m$RG_NAME\e[0m already exists."
fi

printf "%b\n" "## Checking KeyVault \e[32m$KV_NAME\e[0m."
kv_exists=$(az keyvault list -g $RG_NAME --query "[?name=='$KV_NAME']" | jq '. | length')

if [ "$kv_exists" == "0" ]; then
    printf "%b\n" "   Create KeyVault \e[32m$KV_NAME\e[0m in resource group \e[32m$RG_NAME\e[0m."
    kv_created=$(az keyvault create -g $RG_NAME -n $KV_NAME -l $LOCATION)
    printf "%b\n" "   KeyVault \e[32m$KV_NAME\e[0m created."
else
    printf "%b\n" "   KeyVault \e[32m$KV_NAME\e[0m already exists."
fi

printf "%b\n" "## Checking App Service Plan \e[32m$APP_SERVICE_PLAN\e[0m."
app_service_plan_exists=$(az appservice plan list -g $RG_NAME --query "[?name=='$APP_SERVICE_PLAN']" | jq '. | length')

if [ "$app_service_plan_exists" == "0" ]; then
    printf "%b\n" "   Create App Service plan \e[32m$APP_SERVICE_PLAN\e[0m in resource group \e[32m$RG_NAME\e[0m."
    app_service_plan_created=$(az appservice plan create -g $RG_NAME -n $APP_SERVICE_PLAN)
    app_service_plan_created_location=$(echo $app_service_plan_created | jq -r '.location')
    printf "%b\n" "   App Service Plan \e[32m$APP_SERVICE_PLAN\e[0m created."
    printf "%b\n" "   Location:\e[32m$app_service_plan_created_location\e[0m."
else
    printf "%b\n" "   App Service Plan \e[32m$APP_SERVICE_PLAN\e[0m already exists."
fi


printf "%b\n" "## Checking App Service for Web UI \e[32m$WEB_UI_NAME\e[0m."
web_ui_exists=$(az webapp list -g $RG_NAME --query "[?name=='$WEB_UI_NAME']" | jq '. | length')

if [ "$web_ui_exists" == "0" ]; then
    printf "%b\n" "   Create App Service for Web UI \e[32m$WEB_UI_NAME\e[0m in resource group \e[32m$RG_NAME\e[0m."
    web_ui_created=$(az webapp create -g $RG_NAME -p $APP_SERVICE_PLAN -n $WEB_UI_NAME -r "DOTNETCORE|3.1")
    web_ui_created_update=$(az webapp config set -g $RG_NAME -n $WEB_UI_NAME --use-32bit-worker-process false)
    printf "%b\n" "   App Service for Web UI \e[32m$WEB_UI_NAME\e[0m created."
else
    printf "%b\n" "   App Service for Web UI \e[32m$WEB_UI_NAME\e[0m already exists."
    web_ui_created=$(az webapp show -g $RG_NAME -n $WEB_UI_NAME)
fi

web_ui_created_defaultHostName=$(echo $web_ui_created | jq -r '.defaultHostName')
printf "%b\n" "   Default Host Name:\e[32m$web_ui_created_defaultHostName\e[0m."


printf "%b\n" "## Checking App Service for Web API \e[32m$WEB_API_NAME\e[0m."
web_api_exists=$(az webapp list -g $RG_NAME --query "[?name=='$WEB_API_NAME']" | jq '. | length')

if [ "$web_api_exists" == "0" ]; then
    printf "%b\n" "   Create App Service for Web API \e[32m$WEB_API_NAME\e[0m in resource group \e[32m$RG_NAME\e[0m."
    web_api_created=$(az webapp create -g $RG_NAME -p $APP_SERVICE_PLAN -n $WEB_API_NAME -r "DOTNETCORE|3.1")
    web_api_created_update=$(az webapp config set -g $RG_NAME -n $WEB_API_NAME --always-on true --use-32bit-worker-process false)
    printf "%b\n" "   App Service for Web API \e[32m$WEB_API_NAME\e[0m created."
else
    printf "%b\n" "   App Service for Web API \e[32m$WEB_API_NAME\e[0m already exists."
    web_api_created=$(az webapp show -g $RG_NAME -n $WEB_API_NAME)
fi

web_api_created_defaultHostName=$(echo $web_api_created | jq -r '.defaultHostName')
printf "%b\n" "   Default Host Name:\e[32m$web_api_created_defaultHostName\e[0m."


printf "%b\n" "## Checking CosmosDB \e[32m$COSMOSDB_NAME\e[0m."
cosmosdb_exists=$(az cosmosdb list -g $RG_NAME --query "[?name=='$COSMOSDB_NAME']" | jq '. | length')

if [ "$cosmosdb_exists" == "0" ]; then
    printf "%b\n" "   Create CosmosDB \e[32m$COSMOSDB_NAME\e[0m in resource group \e[32m$RG_NAME\e[0m."
    cosmosdb_created=$(az cosmosdb create -g $RG_NAME  -n $COSMOSDB_NAME)
    printf "%b\n" "   CosmosDB \e[32m$COSMOSDB_NAME\e[0m created."
else
    cosmosdb_created=$(az cosmosdb show -g $RG_NAME  -n $COSMOSDB_NAME)
    printf "%b\n" "   CosmosDB \e[32m$COSMOSDB_NAME\e[0m already exists."
fi

cosmosdb_created_document_endpoint=$(echo $cosmosdb_created | jq -r '.documentEndpoint')
printf "%b\n" "   Document Endpoint:\e[32m$cosmosdb_created_document_endpoint\e[0m."
cosmosdb_created_primary_master_key=$(az cosmosdb keys list -n $COSMOSDB_NAME -g $RG_NAME --type keys | jq -r '.primaryMasterKey')
printf "%b\n" "   Primary Master Key:\e[32m$cosmosdb_created_primary_master_key\e[0m."

comsmosdb_kv_primary_master_key_exists=$(az keyvault secret list --vault-name $KV_NAME --query "[?name=='cosmosbprimarymasterkey']" | jq '. | length')
if [ "$comsmosdb_kv_primary_master_key_exists" == "0" ]; then
  comsmosdb_kv_primary_master_key=$(az keyvault secret set --name cosmosbprimarymasterkey --vault-name $KV_NAME --value $cosmosdb_created_primary_master_key)
  printf "%b\n" "   Primary Master Key from Cosmos DB added to keyvault \e[32m$KV_NAME\e[0m."
fi  

printf "%b\n" "## Checking SignalR Services \e[32m$SIGNALR_SERVICES_NAME\e[0m."
signalr_exists=$(az signalr list -g $RG_NAME --query "[?name=='$SIGNALR_SERVICES_NAME']" | jq '. | length')

if [ "$signalr_exists" == "0" ]; then
    printf "%b\n" "   Create SignalR Services \e[32m$SIGNALR_SERVICES_NAME\e[0m in resource group \e[32m$RG_NAME\e[0m."
    signalr_created=$(az signalr create -g $RG_NAME -n $SIGNALR_SERVICES_NAME --sku Standard_S1 --unit-count 1 --service-mode Default)
    printf "%b\n" "   SignalR Services \e[32m$SIGNALR_SERVICES_NAME\e[0m created."
else
    printf "%b\n" "   SignalR Services \e[32m$SIGNALR_SERVICES_NAME\e[0m already exists."
    signalr_created=$(az signalr show -g $RG_NAME -n $SIGNALR_SERVICES_NAME)
fi

signalr_created_host_name=$(echo $signalr_created | jq -r '.hostName')
printf "%b\n" "   Host Name:\e[32m$signalr_created_host_name\e[0m."
signalr_created_primary_connection_string=$(az signalr key list -n $SIGNALR_SERVICES_NAME -g $RG_NAME  | jq -r '.primaryConnectionString')
printf "%b\n" "   Primary Connection String:\e[32m$signalr_created_primary_connection_string\e[0m."

signalr_kv_primary_connection_string_exists=$(az keyvault secret list --vault-name $KV_NAME --query "[?name=='signalrprimaryconnectionstring']" | jq '. | length')
if [ "$signalr_kv_primary_connection_string_exists" == "0" ]; then
  signalr_kv_primary_connection_string=$(az keyvault secret set --name signalrprimaryconnectionstring --vault-name $KV_NAME --value $signalr_created_primary_connection_string)
  printf "%b\n" "   Primary Connection String from SignalR Services added to keyvault \e[32m$KV_NAME\e[0m."
fi  


# Create Purview
printf "%b\n" "## Checking Purview \e[32m$PURVIEW_NAME\e[0m."
purview_deployment_already_exists=$(az resource list -g $RG_NAME | jq -r '.[] | select(.type=="Microsoft.Purview/accounts") | [.] | length')

if [ "x$purview_deployment_already_exists" == "x" ]; then

  cat <<EOF > purview.json
  {
    "\$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
      {
        "name": "$PURVIEW_NAME",
        "type": "Microsoft.Purview/accounts",
        "apiVersion": "2020-12-01-preview",
        "location": "$LOCATION",
        "identity": {
          "type": "SystemAssigned"
        },
        "properties": {
          "networkAcls": {
            "defaultAction": "Allow"
          }
        },
        "dependsOn": [],
        "sku": {
          "name": "Standard",
          "capacity": "4"
        },
        "tags": {}
      }
    ],
    "outputs": {}
  }
EOF

  printf "%b\n" "   Create Purview instance \e[32m$PURVIEW_NAME\e[0m in resource group \e[32m$RG_NAME\e[0m."
  purview_deployment_created=$(az deployment group create --resource-group $RG_NAME --template-file "purview.json")
  printf "%b\n" "   Purview instance \e[32m$PURVIEW_NAME\e[0m created."
  rm purview.json
else
  printf "%b\n" "   Purview instance \e[32m$PURVIEW_NAME\e[0m in resource group \e[32m$RG_NAME\e[0m already exists."
fi


# Create the application
printf "%b\n" "## Create Or Patch Azure AD Application"
azure_ad_application=$(az ad app create --display-name "${SERVICE_PRINCIPAL_NAME}" \
    --homepage "${HomePage}" \
    --reply-urls ${ReturnUris} \
    --available-to-other-tenants \
    --oauth2-allow-implicit-flow)

app_id=$(echo "${azure_ad_application}" | jq -r '.appId')
app_object_id=$(echo "${azure_ad_application}" | jq -r '.objectId')

printf "%b\n" "   ClientId:\e[32m${app_id}\e[0m"

printf "%b\n" "## Update Identifier Uri"
application_update=$(az ad app update --id ${app_id} --identifier-uris https://${DOMAIN}/${app_id})
printf "%b\n" "   Identifier Uri:\e[32mhttps://${DOMAIN}/${app_id}\e[0m"

# Create the service principal associated to AD Application

printf "%b\n" "## Check if Azure AD Service Principal for Application \e[32m$SERVICE_PRINCIPAL_NAME\e[0m exists"
service_principal_exists=$(az ad sp list --display-name $SERVICE_PRINCIPAL_NAME --query "[?appId=='$app_id']" | jq '. | length')


sleep_and_spin() {
    local NUM_SEC=$1

    sleep $NUM_SEC & PID=$!

    printf "   [\e[93m"
    while kill -0 $PID 2> /dev/null; do 
        printf  "▓"
        sleep 1
    done
    printf "%b\n" "\e[0m]."

}


if [ "$service_principal_exists" == "0" ]; then
    printf "%b\n" "   Create Azure AD Application Service Principal"
    servicePrincipal=$(az ad sp create --id "${app_id}")
    service_principal_id=$(echo "${servicePrincipal}" | jq -r '.objectId')
    printf "%b\n" "   ClientObjectId:\e[32m${service_principal_id}\e[0m"
    printf "%b\n" "   Waiting \e[31m1\e[0m minute for AD propagation"
    sleep_and_spin 60 # Waits 1 minute.
else
    printf "%b\n" "   Service Principal for Azure AD Application already exists."
    servicePrincipal=$(az ad sp show --id "${app_id}")
    service_principal_id=$(echo "${servicePrincipal}" | jq -r '.objectId')
    printf "%b\n" "   ClientObjectId:\e[32m${service_principal_id}\e[0m"
fi



printf "%b\n" "## Check \e[32mAdmin\e[0m Role."
adminrole_exists=$(echo $azure_ad_application | jq '.appRoles | length')


if [ "$adminrole_exists" == "0" ]; then
    
    # Generate role Id
    adminrole_id=$(uuidgen)

    # Generate app roles manifest file
    cat <<EOF > app-roles.manifest.json
    [{
        "allowedMemberTypes": [
            "User"
        ],
        "description": "Project Y Admin Users",
        "displayName": "Admin",
        "id": "$adminrole_id",
        "isEnabled": true,
        "lang": null,
        "origin": "Application",
        "value": "Admin"
    }]
EOF
    printf "%b\n" "   Create Admin Role."
    admin_role=$(az ad app update --id "${app_object_id}" --app-roles @app-roles.manifest.json)
    printf "%b\n" "   \e[32mAdmin\e[0m Role \e[32m$adminrole_id\e[0m created."
    rm app-roles.manifest.json
    printf "%b\n" "   Waiting \e[31m1\e[0m minute for AD propagation"
    sleep_and_spin 60 # Waits 1 minute.
else
    adminrole_id=$(echo $azure_ad_application | jq -r '.appRoles[0].id')
    printf "%b\n" "   \e[32mAdmin\e[0m Role \e[32m$adminrole_id\e[0m already exists."
fi


# Checking admin role assigned to current user
printf "%b\n" "## Checking \e[32mAdmin\e[0m Role is assigned to current user."
# There is no azure cli method to make an app role assignement to a spn
# So, making it through graph.microsoft.com 
token_response=$(az account get-access-token --resource 00000003-0000-0000-c000-000000000000)
token=$(jq .accessToken -r <<< "$token_response")

# Check if role exists
graph_admin_role_assignment_exists_api=$(curl -sf https://graph.microsoft.com/v1.0/users/${currentPrincipalId}/appRoleAssignments -H "Authorization: Bearer $token")
graph_admin_role_assignment_exists=$(echo $graph_admin_role_assignment_exists_api | jq '.value[] | select(.resourceId=="'$service_principal_id'" and .appRoleId=="'$adminrole_id'") | [.] | length')

if [ "x$graph_admin_role_assignment_exists" == "x" ]; then

    # Affect Admin Role assignment for current user
    graph_admin_role_assignment_created=$(curl -sf -X POST https://graph.microsoft.com/v1.0/users/${currentPrincipalId}/appRoleAssignments \
                        -H "Authorization: Bearer $token" \
                        -H "Content-type: application/json" \
                        -d "{\"principalId\": \"${currentPrincipalId}\", \"resourceId\": \"${service_principal_id}\", \"appRoleId\": \"${adminrole_id}\" }")

    printf "%b\n" "   Role \e[32mAdmin\e[0m assigned to current user."
else
    printf "%b\n" "   Role \e[32mAdmin\e[0m already assigned to current user."
fi


printf "%b\n" "## Create Graph & API access."
user_impersonation_id=$(az ad app show --id ${app_id} | jq -r '.oauth2Permissions[0].id')
# Generate app roles manifest file
cat <<EOF > resources.manifest.json
[{
    "resourceAppId": "00000003-0000-0000-c000-000000000000",
    "resourceAccess": [
        {
            "id": "b340eb25-3456-403f-be2f-af7a0d370277",
            "type": "Scope"
        },
        {
            "id": "e1fe6dd8-ba31-4d61-89e7-88639da4683d",
            "type": "Scope"
        }
   ]
},
{
    "resourceAppId": "${app_id}",
    "resourceAccess": [
        {
            "id": "${user_impersonation_id}",
            "type": "Scope"
        }
   ]
}]
EOF

# Update Application Roles
graph_resources=$(az ad app update --id "${app_object_id}" --required-resource-accesses @resources.manifest.json)
printf "%b\n" "   Resources access updated."
rm resources.manifest.json

printf "%b\n" "## Create Client Secret"
client_secret=$(az ad app credential reset --id ${app_id} --years 1 --only-show-errors | jq -r '.password')
printf "%b\n" "   Client Secret created."
printf "%b\n" "   ClientSecret:\e[32m${client_secret}\e[0m"

client_secret_kv=$(az keyvault secret set --name clientsecret --vault-name $KV_NAME --value $client_secret)
printf "%b\n" "   ClientSecret from Application added to keyvault \e[32m$KV_NAME\e[0m."


# Check if isFallbackPublicClient is correctly set to true
printf "%b\n" "## Check isFallbackClient value"
graph_app=$(curl -sf https://graph.microsoft.com/v1.0/applications/${app_object_id} -H "Authorization: Bearer $token")
graph_app_is_fallback_client=$(echo $graph_app | jq -r '.isFallbackPublicClient')


if [ "x$graph_app_is_fallback_client" != "xtrue" ]; then

    # Affect Admin Role assignment for current user
    graph_app_is_fallback_assignment=$(curl -sf -X POST https://graph.microsoft.com/v1.0/applications/${app_object_id} \
                        -H "Authorization: Bearer $token" \
                        -H "Content-type: application/json" \
                        -X PATCH \
                        -d "{\"isFallbackPublicClient\": true }")

    printf "%b\n" "   \e[32misFallbackClient\e[0m set correctly to true."
else
    printf "%b\n" "   \e[32misFallbackClient\e[0m already set to true."
fi

printf "%b\n" "## Checking role Storage Blob Data Reader assignement to Service Principal."
role_storage_blob_data_reader_exists=$(az role assignment list --assignee ${app_id} --role "Storage Blob Data Reader" | jq '. | length')

if [ "$role_storage_blob_data_reader_exists" == "0" ]; then
    printf "%b\n" "   Adding role assignement Storage Blob Data Reader to Service Principal"
    role_storage_blob_data_reader=$(az role assignment create --subscription ${subscription_id} --assignee ${app_id} --role "Storage Blob Data Reader")
    printf "%b\n" "   Service Principal role assignement \e[32mStorage Blob Data Reader\e[0m done."
else
    printf "%b\n" "   Service Principal already has role \e[32mStorage Blob Data Reader\e[0m in the subscription."
fi


printf "%b\n" "## Checking role Contributor assignement to Service Principal."
role_contributor_exists=$(az role assignment list --assignee ${app_id} --role "Contributor" | jq '. | length')

if [ "$role_contributor_exists" == "0" ]; then
    printf "%b\n" "   Adding role assignement Contributor to Service Principal"
    role_contributor=$(az role assignment create --subscription ${subscription_id} --assignee ${app_id} --role "Contributor")
    printf "%b\n" "   Service Principal role assignement \e[32mContributor\e[0m done."
else
    printf "%b\n" "   Service Principal already has role \e[32mContributor\e[0m in the subscription."
fi

printf "%b\n" "## Checking role Key Vault Contributor assignement to Service Principal."
role_kv_contributor_exists=$(az role assignment list --assignee ${app_id} --role "Key Vault Contributor" | jq '. | length')

if [ "$role_kv_contributor_exists" == "0" ]; then
    printf "%b\n" "   Adding role assignement Key Vault Contributor"
    role_kv_contributor=$(az role assignment create --subscription ${subscription_id} --assignee ${app_id} --role "Key Vault Contributor")
    printf "%b\n" "   Service Principal role assignement \e[32mKey Vault Contributor\e[0m done."
else
    printf "%b\n" "   Service Principal already has role \e[32mKey Vault Contributor\e[0m in the subscription."
fi

printf "%b\n" "## Checking role User Access Administrator assignement to Service Principal."
role_user_access_admin_exists=$(az role assignment list --assignee ${app_id} --role "User Access Administrator" | jq '. | length')

if [ "$role_user_access_admin_exists" == "0" ]; then
    printf "%b\n" "   Adding role assignement User Access Administrator"
    user_access_admin=$(az role assignment create --subscription ${subscription_id} --assignee ${app_id} --role "User Access Administrator")
    printf "%b\n" "   Service Principal role assignement \e[32mUser Access Administrator\e[0m done."
else
    printf "%b\n" "   Service Principal already has role \e[32mUser Access Administrator\e[0m in the subscription."
fi


# Set current principal owner of the application
printf "%b\n" "## Set current principal owner of the application"
owner=$(az ad app owner add --id "${app_object_id}" --owner-object-id "${currentPrincipalId}")
printf "%b\n" "   Current Principal is owner of the application."


printf "%b\n" "\e[33m----------------------------------------\e[0m"
printf "%b\n" "App Settings JSON Fragment:"
printf "%b\n" "\e[33m----------------------------------------\e[0m"

printf "%b\n" '\e[33m  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "'${DOMAIN}'",
    "TenantId": "'${tenant_id}'",
    "ClientId": "'${app_id}'",
    "ClientObjectId": "'${service_principal_id}'",
    "CallbackPath": "/signin-oidc",
    "SubscriptionId": "'${subscription_id}'",
    "ClientSecret": "'${client_secret}'"
  },
  "YgdraServices": {
    "BaseAddress": "https://'$web_api_created_defaultHostName'",
    "Scopes": "user_impersonation"
  },
  "YProvider": {
    "Provider": "YCosmosDbProvider",
    "Endpoint": "'$cosmosdb_created_document_endpoint'",
    "AccountKey": "'$cosmosdb_created_primary_master_key'",
    "Database": "Ygdra",
    "Container": "Ygdra"
  },
  "HangFire": {
    "Endpoint": "'$cosmosdb_created_document_endpoint'",
    "AccountKey": "'$cosmosdb_created_primary_master_key'",
    "Database": "Ygdra",
    "Container": "Hangfire"
  },
  "SignalR": {
    "ConnectionString": "'$signalr_created_primary_connection_string'"
  },\e[0m'

printf "%b\n" "\e[33m--------------------------------------------------------------------------\e[0m"

printf "%b\n" "Generating file \e[33m./Ygdra.Host/appsettings.Production.json\e[0m"

cat <<EOF > ./Ygdra.Host/appsettings.Production.json
{  
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "${DOMAIN}",
    "TenantId": "${tenant_id}",
    "ClientId": "${app_id}",
    "ClientObjectId": "${service_principal_id}",
    "CallbackPath": "/signin-oidc",
    "SubscriptionId": "${subscription_id}",
    "ClientSecret": "${client_secret}"
  },
  "Graph": {
    "BaseAddress": "https://graph.microsoft.com/beta",
    "Scopes": "User.Read User.ReadBasic.All"
  },
  "YgdraServices": {
    "BaseAddress": "https://$web_api_created_defaultHostName",
    "Scopes": "user_impersonation"
  },
  "YProvider": {
    "Provider": "YCosmosDbProvider",
    "Endpoint": "$cosmosdb_created_document_endpoint",
    "AccountKey": "$cosmosdb_created_primary_master_key",
    "Database": "Ygdra",
    "Container": "Ygdra"
  },
  "HangFire": {
    "Endpoint": "$cosmosdb_created_document_endpoint",
    "AccountKey": "$cosmosdb_created_primary_master_key",
    "Database": "Ygdra",
    "Container": "Hangfire"
  },
  "SignalR": {
    "ConnectionString": "$signalr_created_primary_connection_string"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  }
}
EOF

printf "%b\n" "Generating file \e[33m./Ygdra.Host/appsettings.Development.json\e[0m"

cat <<EOF > ./Ygdra.Host/appsettings.Development.json
{  
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "${DOMAIN}",
    "TenantId": "${tenant_id}",
    "ClientId": "${app_id}",
    "ClientObjectId": "${service_principal_id}",
    "CallbackPath": "/signin-oidc",
    "SubscriptionId": "${subscription_id}",
    "ClientSecret": "${client_secret}"
  },
  "Graph": {
    "BaseAddress": "https://graph.microsoft.com/beta",
    "Scopes": "User.Read User.ReadBasic.All"
  },
  "YgdraServices": {
    "BaseAddress": "https://${WEB_API_LOCAL_NAME}",
    "Scopes": "user_impersonation"
  },
  "YProvider": {
    "Provider": "YCosmosDbProvider",
    "Endpoint": "$cosmosdb_created_document_endpoint",
    "AccountKey": "$cosmosdb_created_primary_master_key",
    "Database": "Ygdra",
    "Container": "Ygdra"
  },
  "HangFire": {
    "Endpoint": "$cosmosdb_created_document_endpoint",
    "AccountKey": "$cosmosdb_created_primary_master_key",
    "Database": "Ygdra",
    "Container": "Hangfire"
  },
  "SignalR": {
    "ConnectionString": "$signalr_created_primary_connection_string"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  }
}
EOF

printf "%b\n" "Generating file \e[33m./Ygdra.Web.UI/appsettings.Production.json\e[0m"


cat <<EOF > ./Ygdra.Web.UI/appsettings.Production.json
{  
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "${DOMAIN}",
    "TenantId": "${tenant_id}",
    "ClientId": "${app_id}",
    "ClientObjectId": "${service_principal_id}",
    "CallbackPath": "/signin-oidc",
    "SubscriptionId": "${subscription_id}",
    "ClientSecret": "${client_secret}"
  },
  "Graph": {
    "BaseAddress": "https://graph.microsoft.com/beta",
    "Scopes": "User.Read User.ReadBasic.All"
  },
  "YgdraServices": {
    "BaseAddress": "https://$web_api_created_defaultHostName",
    "Scopes": "user_impersonation"
  },
  "SignalR": {
    "ConnectionString": "$signalr_created_primary_connection_string"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  }
}
EOF

printf "%b\n" "Generating file \e[33m./Ygdra.Web.UI/appsettings.Development.json\e[0m"

cat <<EOF > ./Ygdra.Web.UI/appsettings.Development.json
{  
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "${DOMAIN}",
    "TenantId": "${tenant_id}",
    "ClientId": "${app_id}",
    "ClientObjectId": "${service_principal_id}",
    "CallbackPath": "/signin-oidc",
    "SubscriptionId": "${subscription_id}",
    "ClientSecret": "${client_secret}"
  },
  "Graph": {
    "BaseAddress": "https://graph.microsoft.com/beta",
    "Scopes": "User.Read User.ReadBasic.All"
  },
  "YgdraServices": {
    "BaseAddress": "https://${WEB_API_LOCAL_NAME}",
    "Scopes": "user_impersonation"
  },
  "SignalR": {
    "ConnectionString": "$signalr_created_primary_connection_string"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  }
}
EOF
printf "%b\n" "\e[33m--------------------------------------------------------------------------\e[0m"
echo "Done."
