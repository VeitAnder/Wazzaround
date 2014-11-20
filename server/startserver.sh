#!/bin/sh

# Maximilian Schmid - August 2011
# ShellScriptingHowTo
# http://www.ooblick.com/text/sh/
# http://www.freeos.com/guides/lsst/

#set scriptpath
SCRIPTPATH=`dirname $0`

<<<<<<< HEAD
# set NODE_ENV to development, on nodejitsu development is called beta
export NODE_ENV=local

=======
>>>>>>> 8cfa8dc86b56b2330f85dfb3276e688ba6c68f1f
export maintainancemode=false

sh ${SCRIPTPATH}/startserver_main.sh