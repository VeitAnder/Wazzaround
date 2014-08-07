#!/bin/sh

# Maximilian Schmid - August 2011
# ShellScriptingHowTo
# http://www.ooblick.com/text/sh/
# http://www.freeos.com/guides/lsst/

# this will cause the shell to exit immediately if on command exits with non zero value
set -e

#set scriptpath
SCRIPTPATH=`dirname $0`

MODULUS_USERNAME=reactureapp
MODULUS_APPNAME=reactureappdev
MODULUS_DEVELOPMENT_PASSWORD=sYpZo2TzWn4HAK

echo "\n\nnode version used:"
node --version

# if no grunt found
echo "When no grunt binary is found, install it via [sudo] npm install -g grunt-cli"
echo "grunt binary path:"
which grunt
echo "\n\ngrunt version used:"
grunt --version

#build server
echo "build release of server"
grunt --gruntfile ${SCRIPTPATH}/gruntFile.js bump:patch
grunt --gruntfile ${SCRIPTPATH}/gruntFile.js release

#build clientapp
echo "build release of clientapp"
grunt --gruntfile ${SCRIPTPATH}/../client/gruntFile.js bump:patch
grunt --gruntfile ${SCRIPTPATH}/../client/gruntFile.js release

#copy clientapp to server dir for deployment
echo "rsync clientapp to server dir"
rsync -av ${SCRIPTPATH}/../client/dist/ ${SCRIPTPATH}/clientapp/
chmod -R 777 ${SCRIPTPATH}/clientapp/*

echo "When no modulus commmand is found in your path, install it via [sudo] npm install -g modulus"

echo "Modulus deploy start"
modulus logout
echo "Login as $MODULUS_USERNAME and deploy $MODULUS_APPNAME:"
modulus login --username $MODULUS_USERNAME  --password $MODULUS_DEVELOPMENT_PASSWORD
modulus deploy -p $MODULUS_APPNAME
modulus logout

#remove clientapp from server dir
echo "remove clientapp dir from server dir"
rm -R ${SCRIPTPATH}/clientapp

open https://reactureappdev-10669.onmodulus.net/