::@echo off

ECHO GENERATING DEPENDENCIES README
cd appgen/
python gendependencies.py
cd ..

::@echo on