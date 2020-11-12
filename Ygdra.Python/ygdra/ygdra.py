import os
from pyspark.sql import *
from pyspark.sql.functions import *
from pyspark.sql.types import *
from azure.identity import DefaultAzureCredential
import requests
import http.client
import json


class ygdraHelpers:

    def __init__(self, engine_name):
        self.engine_name = engine_name
        print(self.engine_name)

    def auth(self):

        scope = os.getenv("YGDRA_SCOPE")
        # AZURE_CLIENT_ID, AZURE_CLIENT_SECRET and AZURE_TENANT_ID should be present in env variables
        credential = DefaultAzureCredential()
        access_token = credential.get_token(scope)
        return access_token.token

    def getEngine(self):

        token = self.auth()

        headers = {'Content-Type': 'application/json',
                   'Authorization': 'Bearer ' + token}

        url = os.getenv("YGDRA_HOST") + "/api/engines/daemon/name/" + \
            os.getenv("YGDRA_ENGINE_NAME")

        res = requests.get(url, headers=headers, verify=False)
        engine = json.loads(res.text)

        return engine

    def init(self):

        try:
            spark
        except NameError:
            spark = SparkSession.builder.getOrCreate()

        client_id = os.getenv("AZURE_CLIENT_ID")
        client_secret = os.getenv("AZURE_CLIENT_SECRET")
        tenant_id = os.getenv("AZURE_TENANT_ID")
        auth_url = "https://login.microsoftonline.com/" + tenant_id + "/oauth2/token"

        spark.conf.set("fs.azure.account.auth.type", "OAuth")
        spark.conf.set("fs.azure.account.oauth.provider.type",
                       "org.apache.hadoop.fs.azurebfs.oauth2.ClientCredsTokenProvider")
        spark.conf.set("fs.azure.account.oauth2.client.id", client_id)
        spark.conf.set("fs.azure.account.oauth2.client.secret", client_secret)
        spark.conf.set("fs.azure.account.oauth2.client.endpoint", auth_url)

    def getDataframe(self, path: StringType):

        # try:
        #     spark
        # except NameError:
        #     spark = SparkSession.builder.getOrCreate()

        return path