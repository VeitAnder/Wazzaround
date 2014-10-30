#!/bin/bash

#set scriptpath
SCRIPTPATH=`dirname $0`

set -e

echo "\n\nnode version used:"
node --version
echo "to use other node version, checkout node version manager: nvm \n\n "

echo "\n\nimport local database:"
cd dbtools
./mongoimport_local.sh ./dumps/local/
cd ..

# install packages on client and server
echo "\n\ninstalling npm packages on server..."
cd server
npm install
echo "installing npm packages on server done."

echo "\n\ninstalling npm packages on client..."
cd ../client/
npm install
echo "\n\ninstalling npm packages on client done."

echo "\n\ninstalling bower packages on client..."
bower install --config.interactive=false
echo "\n\ninstalling bower packages on client done."
