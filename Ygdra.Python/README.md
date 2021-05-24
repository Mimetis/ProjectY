
# Ygdra python package

This package is used in databricks and azure synapse notebooks. It contains wrapper around ygdra service api and helper functions.

## Build wheel package

### Update (if needed) setup.py to increase version number.

```python
from setuptools import setup

setup(name='ygdra',
      version='1.0',
      description='Ygdra helpers',
      url='http://github.com/Mimetis/ProjectY',
      author='Sébastien Pertus',
      author_email='spertus@microsoft.com',
      license='MIT',
      packages=['ygdra'],
      install_requires=['azure-identity']
      )
```

### Install (if needed) wheel and setuptools packages

```bash
pip install -U wheel setuptools
```

### Build the wheel package

```bash
python setup.py sdist bdist_wheel
```

Wheel package will be created in `/dist` folder.