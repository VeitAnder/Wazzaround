var config = require("../config.js");

var collection = "mm-migration";
var directory = "migrations";
var mm_config;

if (config.mongo.local) {
  mm_config = {
    local: config.mongo.local,
    db: config.mongo.dbName,
    host: "localhost",
    port: "27017",
    collection: collection,
    directory: directory
  };
}
else {
  mm_config = {
    local: config.mongo.local,
    host: config.mongo.host.split(":")[0],
    port: config.mongo.host.split(":")[1],
    db: config.mongo.dbName,
    user: config.mongo.username,
    password: config.mongo.password,
    collection: collection,
    directory: directory
  };
}

module.exports = mm_config;