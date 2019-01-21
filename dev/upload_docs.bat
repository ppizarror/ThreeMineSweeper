@echo off

ECHO UPDATING DOCS

cd ..
git add -f docs/*
git commit -m "Update docs"
git push
cd dev

@echo on