#!/usr/bin/env python
# -*- coding: utf-8 -*-

from setuptools import setup

try:
    long_description = open("README.md").read()
except IOError:
    long_description = "A Bottle and AJAX exercise: Command-line interface chat shell"

setup(
    name="clics",
    version="0.1.0",
    description="Command-line interface chat shell",
    license="MIT",
    author="AnqurVanillapy",
    author_email="anqurvanillapy@gmail.com",
    url="https://github.com/anqurvanillapy/clics",
    packages=['clics'],
    package_data={'clics': ['layouts/*.*']},
    long_description=long_description,
    entry_points={
        'console_scripts': [
            'clics=clics.clics:main',
        ],
    },
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Programming Language :: Python",
        "Programming Language :: Python :: 2.7",
    ]
)
