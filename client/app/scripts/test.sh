find . | grep .js | while read -r line ; do
  echo '<script src="'scripts/$line'"></script>' | sed 's/\.\///g'
done
