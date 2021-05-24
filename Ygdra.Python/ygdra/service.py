import json
import os
import requests

from azure.identity import ClientSecretCredential


class YService:

    def __init__(self, sp_client_secret: str, base_url: str = None, engine_id: str = None) -> None:
        """
        YService constructor method.

        Parameters
        ----------
        sp_client_secret : str
            Service principal client secret.
        base_url: str
            Base url targeting ygdra api service. 
            If None (default), will parse YGDRA_API_URL environment variable.
        engine_id: str
            Engine id. 
            If None (default), will parse YGDRA_ENGINE_ID environment variable.
        """

        if not base_url:
            base_url = os.getenv('YGDRA_API_URL')
        if not engine_id:
            engine_id = os.getenv("YGDRA_ENGINE_ID")

        if not sp_client_secret:
            raise ValueError('sp_client_secret input value is null or empty')
        if not base_url:
            raise ValueError('base_url input value is null or empty')
        if not engine_id:
            raise ValueError('engine_id input value is null or empty')

        self.sp_client_secret = sp_client_secret
        self.base_url = base_url
        self.engine_id = engine_id

    def init_access_token(self, ad_tenant_id: str = None, sp_client_id: str = None, ad_domain: str = None, debug_mode: bool = False) -> str:
        """
        Initialize access token to access ygdra api.

        Parameters
        ----------
        ad_tenant_id : str
            Tenant id.
            If None (default), will parse AD_TENANT_ID environment variable.
        sp_client_id: str
            Service principal client id. 
            If None (default), will parse SP_CLIENT_ID environment variable.
        ad_domain: str
            Principal domain. 
            If None (default), will parse AD_DOMAIN environment variable.
        debug_mode: bool
            Indicates if you want output intermediate steps. False by default.
        """

        if not ad_tenant_id:
            ad_tenant_id = os.getenv('AD_TENANT_ID')
        if not sp_client_id:
            sp_client_id = os.getenv('SP_CLIENT_ID')
        if not ad_domain:
            ad_domain = os.getenv('AD_DOMAIN')

        if not ad_tenant_id:
            raise ValueError('ad_tenant_id input value is null or empty')
        if not sp_client_id:
            raise ValueError('sp_client_id input value is null or empty')
        if not ad_domain:
            raise ValueError('ad_domain input value is null or empty')

        credential = ClientSecretCredential(
            ad_tenant_id,
            sp_client_id,
            self.sp_client_secret)

        scope = f'https://{ad_domain}/{sp_client_id}/.default'

        if(debug_mode):
            print(f'tenantId: {ad_tenant_id}')
            print(f'clientId: {sp_client_id}')
            print(f'domain: {ad_domain}')
            print(f'scope: {scope}')

        access_token = credential.get_token(scope)
        self.token = access_token.token
        return access_token.token

    def get_engine(self, debug_mode: bool = False):
        """
        Get ygdra engine.

        Parameters
        ----------
        debug_mode: bool
            Indicates if you want output intermediate steps. False by default.
        """

        bearer = f'Bearer {self.token}'
        headers = {'Content-Type': 'application/json', 'Authorization': bearer}
        url = f'{self.base_url}/api/engines/daemon/{self.engine_id}'

        if(debug_mode):
            print(f'bearer: {bearer}')
            print(f'url: {url}')

        res = requests.get(url=url, headers=headers, verify=False)
        engine = json.loads(res.text)
        return engine

    def get_entity(self, entity_name: str, debug_mode: bool = False):
        """
        Get ygdra entity.

        Parameters
        ----------
        debug_mode: bool
            Indicates if you want output intermediate steps. False by default.
        """

        if not entity_name:
            raise ValueError('entity_name input value is null or empty')

        bearer = f'Bearer {self.token}'
        headers = {'Content-Type': 'application/json', 'Authorization': bearer}
        url = f'{self.base_url}/api/datafactories/{self.engine_id}/daemon/entities/{entity_name}'

        if(debug_mode):
            print(f'bearer: {bearer}')
            print(f'url: {url}')

        res = requests.get(url, headers=headers, verify=False)
        entity = json.loads(res.text)
        return entity

    def add_metric(self, metric: str, entity_name: str, datasource_name: str, version: str, debug_mode: bool = False):
        """
        Add ygdra metric.

        Parameters
        ----------
        metric: str
            Metric payload.
        entity_name: str
            Entity name.
        datasource_name: str
            Datasource name.
        version: str
            Version.
        debug_mode: bool
            Indicates if you want output intermediate steps. False by default.
        """

        if not metric:
            raise ValueError('metric input value is null or empty')
        if not entity_name:
            raise ValueError('entity_name input value is null or empty')
        if not datasource_name:
            raise ValueError('datasource_name input value is null or empty')
        if not version:
            raise ValueError('datasource_name input value is null or empty')

        bearer = f'Bearer {self.token}'
        headers = {'Content-Type': 'application/json', 'Authorization': bearer}
        url = f'{self.base_url}/api/appinsights/{self.engine_id}/daemon/metrics/{datasource_name}/{entity_name}/{version}'

        if(debug_mode):
            print(f'bearer: {bearer}')
            print(f'url: {url}')

        payload = json.dumps(metric)
        res = requests.post(url, headers=headers, verify=False, data=payload)
        return res
