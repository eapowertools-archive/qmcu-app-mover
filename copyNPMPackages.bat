#!/usr/bin/env bash

if [ "$(uname)" == "Darwin" ]; then
    rsync -r ./appMover/node_modules ../QlikSenseQMCUtility/plugins/appMover
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    echo "Linux not supported."
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]; then
    xcopy appMover\node_modules ..\QlikSenseQMCUtility\plugins\appMover\node_modules /I /Y /R /S
fi
