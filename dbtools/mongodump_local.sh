#!/bin/sh

set -e

source _config.sh
CONFIGJSONFILE=$SECRETCONFIGFILE_LOCAL

MONGODB_HOST=`node -e "console.log( require('$CONFIGJSONFILE').mongo.host )"`
MONGODB_DATABASENAME=`node -e "console.log( require('$CONFIGJSONFILE').mongo.dbName )"`

BACKUPDIR=$BACKUPLOCATION/local

# MongoDB Backup
# dump json
for i in "${MONGOLAB_COLLECTIONS[@]}"
do
  echo "dump" $i
  TARGETFILE=$BACKUPDIR/${i}.json
  mongoexport -h $MONGODB_HOST -d $MONGODB_DATABASENAME -c $i -o $TARGETFILE
done

echo "Backup successfully stored in dir $BACKUPDIR/"