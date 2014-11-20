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

# if no grunt found
echo "When no grunt binary is found, install it via [sudo] npm install -g grunt-cli"
echo "grunt binary path:"
which grunt
echo "\n\ngrunt version used:"
grunt --version

# build server
grunt build

# launch node server
echo "\n\nlaunch node server via 'grunt supervise'"
grunt supervise
