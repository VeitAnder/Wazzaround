#!/bin/sh

echo "heroku - logout any active login"
heroku auth:logout

echo "Login as planfredapp@gmail.com:"
heroku auth:login

git push heroku_appplanfredcom +HEAD:master

heroku auth:logout