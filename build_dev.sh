#!/bin/sh

# this will cause the shell to exit immediately if on command exits with non zero value
set -e

#set scriptpath
SCRIPTPATH=`dirname $0`

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
grunt --gruntfile ${SCRIPTPATH}/gruntFile.js release

#build clientapp
echo "build release of clientapp"
grunt --gruntfile ${SCRIPTPATH}/client/gruntFile.js release