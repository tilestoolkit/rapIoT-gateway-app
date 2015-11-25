from setuptools import setup

setup(name='tileclient',
      version='0.1.1',
      description='TileClient library for real-time and API events',
      author='Jonas Kirkemyr',
      author_email='jonas@kirkemyr.no',
      packages=['tileclient'],
       install_requires=[
          'paho-mqtt',
      ],
      zip_safe=False)