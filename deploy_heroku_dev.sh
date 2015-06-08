#!/bin/sh

echo "heroku - logout any active login"

echo "Login as reactureapp@gmail.com:"
heroku auth:login

git push heroku_devwwwwazzaroundcom +HEAD:master

heroku auth:logout