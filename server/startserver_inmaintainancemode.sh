#!/bin/sh

# Maximilian Schmid - August 2011
# ShellScriptingHowTo
# http://www.ooblick.com/text/sh/
# http://www.freeos.com/guides/lsst/

#set scriptpath
SCRIPTPATH=`dirname $0`

# set NODE_ENV to development, on nodejitsu development is called beta
export NODE_ENV=developmentlocalhost

export maintainancemode=true

sh ${SCRIPTPATH}/startserver_main.sh