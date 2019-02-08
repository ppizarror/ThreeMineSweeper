# coding=utf-8
"""
GENERATE DEPENDENCIES
Generates README.md dependencies list.

Copyright (C) MIT
"""

FILE = '../src/about/dependencies.js'
README = '../lib/README.md'

"""
Get information
"""
dt = []
fl = open(FILE)

record = False
for i in fl:
    if '{' in i:
        record = True
        continue
    if '}' in i:
        record = False
        continue
    if record:
        j = i.split(':')
        libname = j[0].strip().replace('"', '')
        libver = j[1].split(',')[0].strip().replace('"', '')
        if libver == '':
            libver = '-'
        href = i.split(',')[1].strip().replace('// ', '')
        hrefname = href.replace('https://', '').replace('http://', '')
        if hrefname[-1] == '/':
            hrefname = hrefname[0:-1]
        dt.append([libname, libver, hrefname, href])
fl.close()
dt.sort(key=lambda x: x[0])

"""
Generates README
"""
readme = open(README, 'w')
readme.flush()

readme.write("""# ThreeMinesSweeper

## lib/

This directory contains the libraries used by TMS ({0} in total):

| Library | Version | Link |
| :-- | :--: | :-- |
""".format(len(dt)))

# Check each library
for i in dt:
    readme.write('| {0} | {1} | <a href="{3}">{2}</a> |\n'.format(*i))

# Close file
readme.close()
