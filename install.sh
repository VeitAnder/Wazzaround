#!/bin/sh

# Maximilian Schmid - August 2011
# ShellScriptingHowTo
# http://www.ooblick.com/text/sh/
# http://www.freeos.com/guides/lsst/

#set scriptpath
SCRIPTPATH=`dirname $0`



echo "\n\nnode version used:"
node --version
echo "to use other node version, checkout node version manager: nvm \n\n "

# install packages on client and server
echo "\n\ninstalling npm packages on server..."
cd server
pwd
npm install
echo "installing npm packages on server done."

echo "\n\ninstalling npm packages on client..."
cd ../client/
pwd
npm install
echo "\n\ninstalling npm packages on client done."

echo "\n\ninstalling bower packages on client..."
bower install
echo "\n\ninstalling bower packages on client done."