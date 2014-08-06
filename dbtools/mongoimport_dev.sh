#!/bin/sh

source _config.sh
CONFIGJSONFILE=$SECRETCONFIGFILE_DEV

MONGODB_HOST=`node -e "console.log( require('$CONFIGJSONFILE').mongo.host )"`
MONGODB_DATABASENAME=`node -e "console.log( require('$CONFIGJSONFILE').mongo.dbName )"`
MONGODB_USERNAME=`node -e "console.log( require('$CONFIGJSONFILE').mongo.username )"`
MONGODB_PASSWORD=`node -e "console.log( require('$CONFIGJSONFILE').mongo.password )"`

if [ $1 ]
  then
    echo $1
else
    echo "\nPlease provide the relative path to the backup as first argument with a trailing slash. \neg. ./backups/local/2014-06-12-14-53-14025776075/ "
    exit 1
fi

# MongoDB restore from Backup
for i in "${MONGOLAB_COLLECTIONS[@]}"
do
  mongo $MONGODB_DATABASENAME --eval "db.${i}.drop()"
  mongoimport -h $MONGODB_HOST -d $MONGODB_DATABASENAME -u $MONGODB_USERNAME -p $MONGODB_PASSWORD -c $i --type json --file $1${i}.json --drop
done