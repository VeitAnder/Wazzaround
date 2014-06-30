var config;

// set env to local if not defined
if (!process.env.NODE_ENV) {
  console.log("\nprocess.env.NODE_ENV not set. Auto-Change to 'developmentlocalhost' \n");
  process.env.NODE_ENV = "developmentlocalhost";
}

if (process.env.NODE_ENV === "developmentlocalhost") {
  config = require("./config_developmentlocalhost.js");
} else if (process.env.NODE_ENV === "developmentmodulus") {
  config = require("./config_developmentmodulus.js");
} else if (process.env.NODE_ENV === "production") {
  config = require("./config_productionmodulus.js");
} else {
  console.log("FATAL ERROR - process.env.NODE_ENV not properly set !!");
}

module.exports = config;