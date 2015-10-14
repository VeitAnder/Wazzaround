# www.wazzaround.com 
### (formerly www.reacture.com)

## Technology Stack
wazzaround.com is based on the MEAN Stack (https://en.wikipedia.org/wiki/MEAN_(software_bundle)) and is entirely written in ES5 JavaScript.

## Client
The client is an AngularJS App, source is under the folder client. 
For client-dependencies check client/package.json and client/bower.json

## Server
The server APP is a nodeJS/ExpressJS app. For dependencies and nodeJS version requirements please check /package.json.

## ORM-Mapper Modelizer
As ORM solution Jonathan has developed the open source project Modelizer (https://github.com/dreampulse/modelizer). For detailed documentation please checkout the github repo.

## JSON-REST API:
The models are defined in server/models/models.js.
The public REST-API and modelizer client API is found under server/models/server/
The source files are self-documenting the REST-API. Please also consult the modelizer documentation for further understanding of the API. 

## Database
The used database in MongoDB version 2.6

## Build Scripts
Build scripts can be found in the root folder (build_dev.sh and build_release.sh).

## Startup the App and the development tools
Requirements: install nodeJS version 0.10.x
Then simply checkout the repo, run install.sh and then start.sh
