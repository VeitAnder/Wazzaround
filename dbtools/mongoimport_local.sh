#!/bin/sh

set -e

source _config.sh
CONFIGJSONFILE=$SECRETCONFIGFILE_LOCAL

MONGODB_HOST=`node -e "console.log( require('$CONFIGJSONFILE').mongo.host )"`
MONGODB_DATABASENAME=`node -e "console.log( require('$CONFIGJSONFILE').mongo.dbName )"`

if [ $1 ]
  then
    echo $1
else
    echo "\nPlease provide the relative path to the backup as first argument with a trailing slash. \neg. ./dumps/local/ "
    exit 1
fi

# MongoDB restore from Backup
for i in "${MONGOLAB_COLLECTIONS[@]}"
do
  mongo $MONGODB_DATABASENAME --eval "db.${i}.drop()"
  mongoimport -h $MONGODB_HOST -d $MONGODB_DATABASENAME -c $i --type json --file $1${i}.json --drop
done