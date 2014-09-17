#!/bin/sh

# global project configurations
BACKUPLOCATION=./dumps

SECRETCONFIGFILE_LOCAL=../server/config_development_local_mongo.js
SECRETCONFIGFILE_DEV=../config_developmentmodulus.js
SECRETCONFIGFILE_PRODUCTION="./../server/config_productionmodulus.js"

MONGOLAB_COLLECTIONS=(accesstokens activities bookedEvents bookings categories objectlabs-system objectlabs-system.admin.collections users)

# check if planfred truecrypt folder is accessible
#if [ ! -f ${SECRETCONFIGFILE_PRODUCTION} ] || [ ! -f ${SECRETCONFIGFILE_DEV} ]
#then
#    echo "${SECRETCONFIGFILE_PRODUCTION} or ${SECRETCONFIGFILE_DEV} file not found! Not ready to deploy. \n Check if your project truecrypt volume is mounted."
#    exit 0
#fi
