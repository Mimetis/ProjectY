# -*- coding: utf-8 -*-

from setuptools import setup, find_packages

setup(name='ygdra',
      version='1.1',
      description='Ygdra helpers',
      url='http://github.com/Mimetis',
      author='Sébastien Pertus',
      author_email='spertus@microsoft.com',
      license='MIT',
      packages=['ygdra'],
      zip_safe=False,
      install_requires=[
          'azure-identity', 
          'pyspark']
      )
