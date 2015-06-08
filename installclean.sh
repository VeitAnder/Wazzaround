#!/bin/sh

#set scriptpath
SCRIPTPATH=`dirname $0`

rm -R node_modules
rm -R client/node_modules

sh ./install.sh