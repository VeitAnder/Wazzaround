# pre-commit git hook to prevent accidential commit of confidential production server data to git repo

FILE=server/config_productionserver.js
if [ -f $FILE ];
then
  echo "File $FILE exists. It will be removed because it contains sensitive data!"
  rm $FILE
else
  echo "File $FILE does not exist. OK. Git commit can continue."
fi


FILE=server/config_developmentmodulus.js
if [ -f $FILE ];
then
  echo "File $FILE exists. It will be removed because it contains sensitive data!"
  rm $FILE
else
  echo "File $FILE does not exist. OK. Git commit can continue."
fi