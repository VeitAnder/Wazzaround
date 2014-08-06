#!/bin/sh

source _config.sh
CONFIGJSONFILE=$SECRETCONFIGFILE_DEV

MONGODB_HOST=`node -e "console.log( require('$CONFIGJSONFILE').mongo.host )"`
MONGODB_DATABASENAME=`node -e "console.log( require('$CONFIGJSONFILE').mongo.dbName )"`
MONGODB_USERNAME=`node -e "console.log( require('$CONFIGJSONFILE').mongo.username )"`
MONGODB_PASSWORD=`node -e "console.log( require('$CONFIGJSONFILE').mongo.password )"`

BACKUPDIR=$BACKUPLOCATION/dev

# MongoDB Backup
# dump json
for i in "${MONGOLAB_COLLECTIONS[@]}"
do
  echo "dump" $i
  TARGETFILE=$BACKUPDIR/${i}.json
  mongoexport -h $MONGODB_HOST -d $MONGODB_DATABASENAME -u $MONGODB_USERNAME -p $MONGODB_PASSWORD -c $i -o $TARGETFILE
done

echo "Backup successfully stored in dir $BACKUPDIR/"
