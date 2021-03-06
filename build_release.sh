#!/bin/sh

# this will cause the shell to exit immediately if on command exits with non zero value
set -e

#set scriptpath
SCRIPTPATH=`dirname $0`

echo "\n\nnode version used:"
node --version

# https://blog.risingstack.com/node-js-security-checklist/
echo "\n\naudit npm security via nsp"
nsp check
cd client
nsp check
cd ..

# if no grunt found
echo "When no grunt binary is found, install it via [sudo] npm install -g grunt-cli"
echo "grunt binary path:"
which grunt
echo "\n\ngrunt version used:"
grunt --version

#build server
echo "build release of server"
grunt --gruntfile ${SCRIPTPATH}/gruntFile.js release
grunt --gruntfile ${SCRIPTPATH}/gruntFile.js bump:minor

#build clientapp
echo "build release of client"
grunt --gruntfile ${SCRIPTPATH}/client/gruntFile.js release
git add .
git commit -m "Client release build commit"
grunt --gruntfile ${SCRIPTPATH}/client/gruntFile.js bump:minor

