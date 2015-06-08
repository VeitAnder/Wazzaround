#!/bin/bash

#set scriptpath
SCRIPTPATH=`dirname $0`

set -e

echo -e "\n\nnode version used:"
node --version
echo "to use other node version, checkout node version manager: nvm \n\n "

echo -e "\n\nimport local database:"
cd dbtools
./mongoimport_local.sh ./dumps/local/
cd ..

# install packages on client and server
echo -e "\n\ninstalling npm packages on server..."
npm install
echo "installing npm packages on server done."
echo "building server…"
grunt build
echo "build server done."

echo -e "\n\ninstalling npm packages on client..."
cd client/
npm install
echo "\n\n installing npm packages on client done."

echo -e "\n\ninstalling bower packages on client..."
rm -R app/bower_components
bower install --config.interactive=false --allow-root
echo -e "\n\ninstalling bower packages on client done."
