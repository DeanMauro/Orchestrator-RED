#!/bin/bash
if [ -f /usr/lib/node_modules/orchestrator ]; then
	npm rm --global orchestrator
fi

npm init

npm link
mkdir -p ~/.node-red
cd ~/.node-red
npm link orchestrator
cd -

echo "..."
echo -e "\033[0;92mYou're good to go. Run ./run.sh to start up Orchestrator-RED.\033[0m"