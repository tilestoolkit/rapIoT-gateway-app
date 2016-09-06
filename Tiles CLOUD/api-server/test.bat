@echo off
set arg1=%1
echo %arg1%

cd C:\\gitProjects\\NTNU\\TileDSL
node build/dsl/dsl/index.js example/%arg1%.dsl -r -u jonas

