#!/bin/sh

# Maximilian Schmid - August 2011
# ShellScriptingHowTo
# http://www.ooblick.com/text/sh/
# http://www.freeos.com/guides/lsst/

#set scriptpath
SCRIPTPATH=`dirname $0`

# set NODE_ENV to development, on nodejitsu development is called beta
export NODE_ENV=productionmigrationtest

echo "\n\nnode version used:"
node --version
echo "to use other node version, checkout node version manager: nvm \n\n "

# install packages on client and server
echo "\n\ninstalling npm packages on server..."
npm install
echo "installing npm packages on server done."

echo "\n\ninstalling npm packages on client..."
cd ../client/
npm install
echo "\n\ninstalling npm packages on client done."

echo "\n\ninstalling bower packages on client..."
bower install
echo "\n\ninstalling bower packages on client done."
cd ../server/

# if no grunt found
echo "When no grunt binary is found, install it via [sudo] npm install -g grunt-cli"
echo "grunt binary path:"
which grunt
echo "\n\ngrunt version used:"
grunt --version

#build clientapp
echo "build clientapp"
grunt --gruntfile ${SCRIPTPATH}/../client/gruntFile.js build

# build server
grunt buildfast

# launch node server
echo "\n\nlaunch node server via 'grunt supervise'"
grunt supervise
