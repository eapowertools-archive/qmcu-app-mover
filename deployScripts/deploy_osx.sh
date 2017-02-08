#!/usr/bin/env bash

if [ "$(uname)" == "Darwin" ]; then
    rsync -r ./appMover ../QlikSenseQMCUtility/plugins/ --exclude */node_modules/
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    echo "Linux not supported."
fi