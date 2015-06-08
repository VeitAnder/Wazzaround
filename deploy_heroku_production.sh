#!/bin/sh

echo "heroku - logout any active login"
heroku auth:logout

echo "Login as reactureapp@gmail.com:"
heroku auth:login

git push heroku_wwwwazzaroundcom +HEAD:master

heroku auth:logout