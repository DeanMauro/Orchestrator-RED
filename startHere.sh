#!/bin/bash

npm rm --global orchestrator

npm init

npm link
mkdir ~/.node-red
cd ~/.node-red
npm link orchestrator
cd -

echo "You're good to go. Run ./run.sh to start up Orchestrator-RED."