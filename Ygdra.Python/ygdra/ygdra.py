import os
import IPython
import uuid
from pyspark.sql import DataFrame, SparkSession
from pyspark.sql.functions import mean, stddev, col, min, max , avg, skewness as skew, variance, sum, lit, round, length
from pyspark.sql.types import StringType, IntegerType
import math
import requests
import http.client
import json
from azure.identity import DefaultAzureCredential, ClientSecretCredential
import pandas as pd
from typing import Tuple
import re


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

    async def get_histogram(self, df: DataFrame, attribute: str) -> Tuple[list, list]:
        """ generate data for histogram

        :param df: DataFrame
        :param attribute: column
        :return: histogram bins ad counts
        """
        try:
            bins, counts = df.select(attribute).rdd.flatMap(lambda x: x).histogram(20)
            return bins, counts
        except Exception as ex:
            raise ex


    async def get_stats(self, df: DataFrame, attribute: str) -> dict:
        """ get statistics for numeric columns

        :param df: DataFrame
        :param attribute: column
        :return: dictionary of column statistics
        """
        try:
            df_stats = df.select(
                mean(col(attribute)).alias('mean'),
                round(stddev(col(attribute)), 2).alias('stddev'),
                min(col(attribute)).alias('min'),
                max(col(attribute)).alias('max'),
                avg(col(attribute)).alias('avg'),
                round(skew(col(attribute)), 2).alias('skw'),
                round(variance(col(attribute)), 2).alias('var')
            ).collect()
            df_stats = df_stats[0]
            skewness = df_stats['skw'] if not math.isnan(df_stats['skw']) else 0
            df_stats = {"mean": df_stats['mean'], "stddev": df_stats['stddev'], "min": df_stats['min'],
                        "max": df_stats['max'], "avg": df_stats['avg'], "skw": skewness,
                        "var": df_stats['var']}
            return df_stats
        except Exception as ex:
            raise ex

    async def describe_int(self, stats: dict, attribute: str, df: DataFrame) -> dict:
        """ generate statistics for numeric columns

        :param stats: statistics
        :param attribute: column
        :param df: DataFrame
        :return: list of dictionary(column statistics)
        """
        
        try:
            acceptable_error = 0.01
            stats[attribute]['stats'] = await self.get_stats(df=df, attribute=attribute)
            bins, counts = await self.get_histogram(df=df, attribute=attribute)
            hist = {'bins': bins, 'counts': counts}
            stats[attribute]['hist'] = hist
            quantiles = df.approxQuantile(
                attribute, [0.25, 0.5, 0.75, 0.95], acceptable_error)
            stats[attribute]['quantiles'] = {"25%": quantiles[0], "50%": quantiles[1], "75%": quantiles[2],
                                            "95%": quantiles[3]}
            return stats
        except Exception as ex:
            raise ex

    async def describe_string(self, stats: dict, attribute: str, df: DataFrame) -> dict:
        """ generate statistics for text columns """

        try:
            char_lengths = df.withColumn('strlen', length(col(attribute))) \
                .select('strlen') \
                .agg(min('strlen').alias('minCharacterLength'),
                        max('strlen').alias('maxCharacterLength'),
                        avg('strlen').alias('avgCharacterLength'),
                        stddev('strlen').alias('stddevCharacterLength')) \
                .collect()
            char_lengths = char_lengths[0]
            char_lengths = {"min_char_len": char_lengths['minCharacterLength'],
                            "max_char_len": char_lengths['maxCharacterLength'],
                            "avg_char_len": char_lengths['avgCharacterLength'],
                            "stddev_char_len": char_lengths['stddevCharacterLength']}
            stats[attribute]['char_length'] = char_lengths

            chars = df.filter(col(attribute).rlike("[a-zA-Z]")).limit(1).count()
            digits = df.filter(col(attribute).rlike("[0-9]")).limit(1).count()
            spaces = df.filter(col(attribute).rlike("\s")).limit(1).count()
            non_words = df.filter(col(attribute).rlike("\W")).limit(1).count()
            contains = {
                "chars": True if chars != 0 else False,
                "digits": True if digits != 0 else False,
                "spaces": True if spaces != 0 else False,
                "non-words": True if non_words != 0 else False,
            }

            stats[attribute]["composition"] = contains

            return stats
        except Exception as ex:
            raise ex

    async def get_dist_count(self, spark: SparkSession, entity: str, attribute: str) -> int:
        """ get distinct count of given column

        :param spark: Spark Session
        :param entity: entity name
        :param attribute: column
        :return: (int) distinct count
        """
        try:
            dist_count_df = spark.sql("select 1 as dist_count from " + entity + " group by `" + attribute + "`")
            dist_count = dist_count_df.select(sum(col("dist_count")).alias('dist_count')).collect()[0]
            dist_count = dist_count['dist_count']
            return dist_count
        except Exception as ex:
            raise ex

    async def get_bins_counts_from_list(self, list_of_items: list) -> dict:
        bins = []
        counts = []
        for r in list_of_items:
            for k, v in r.items():
                bins.append(k)
                counts.append(v)
                
        return {'bins': bins, 'counts': counts}

