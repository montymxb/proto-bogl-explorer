#! /bin/bash

# Cleans, Builds, Installs & Deploys the explorer server
stack clean
stack build
stack install

dt=`date +"%F-%T"`
proto-bogl-explorer-exe > logs/proto-bogl-explorer-log-$dt.log 2>&1
