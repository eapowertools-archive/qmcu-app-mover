#!/usr/bin/env bash

if [ "$(uname)" == "Darwin" ]; then
    rsync -r ./appMover/node_modules ../QlikSenseQMCUtility/plugins/appMover
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    echo "Linux not supported."
fi
