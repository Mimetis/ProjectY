import os
import IPython
import uuid
from pyspark.sql import DataFrame, SparkSession, Column
from pyspark.sql.functions import mean, stddev, col, min, max , avg, skewness as skew, variance, sum, lit, round, length, udf
from pyspark.sql.types import StringType, IntegerType, BooleanType
import requests
import http.client
import json
from azure.identity import DefaultAzureCredential, ClientSecretCredential
import pandas as pd
from typing import Tuple
import re

newid = udf(lambda : str(uuid.uuid4()),StringType())


def _has_email_address(inputString:Column):
    if inputString is None:
        return False
    if re.search("([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)", str(inputString)):
        return True
    return False

has_email_address = udf(lambda inputString : _has_email_address(inputString), BooleanType())


# add feature: count numbers in Entity column's cell
def _count_spaces(inputString):
    # return inputString
    if inputString is None:
      return 0
    sumspace = 0
    for c in str(inputString):
      if c.isspace():
        sumspace = sumspace + 1
    return sumspace

count_spaces = udf(lambda inputString : _count_spaces(inputString), StringType())