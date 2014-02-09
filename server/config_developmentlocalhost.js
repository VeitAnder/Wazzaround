/*
 [07.02.14 16:22:57] Maximilian Schmid: reactureapp
 [07.02.14 16:23:01] Maximilian Schmid: 7kdtaTPV9ooAnA

 [07.02.14 16:23:15] Maximilian Schmid: gmail: reactureapp@gmail.com
 [07.02.14 16:23:20] Maximilian Schmid: HpsQni3UJkEEd2

 [07.02.14 16:23:37] Maximilian Schmid: modulus:
 [07.02.14 16:23:38] Maximilian Schmid: reactureapp
 sYpZo2TzWn4HAK

 */


var config = {
  host: "http://localhost:3000/",
  clienthost: "http://localhost:9000/",
  mongo: {
    //username: 'reactureappdev',
    //password: 'pGjRLG72qvXBGo',
    //dbName: 'reactureappdev',                                // The name of database that contains the security information
    //host: 'ds027419.mongolab.com:27419',                         // mongolab mongodb connection url
    url : 'mongodb://127.0.0.1/reacturelocal'
  },
  security: {
    usersCollection: 'users',                                   // The name of the collection contains user information
    passwordencryptionalgorithm: 'aes256',                      // db password encryption algorithm
    passwordencryptionkey: "EdJkKl$§$&-kjlk$ioi23a4t9T7"        // password encryptionkey
  },
  amazons3: {
//    S3_ACCESS_KEY: 'AKIAJVNTGQMMDTGWNI4A',
//    S3_SECRET_KEY: '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',
//    S3_BUCKET_NAME: 'planfredlocalhost',                             // bucket name and bucket URL have to match
//    S3_BUCKET_URL: 'https://planfredlocalhost.s3.amazonaws.com',
//    S3_REGION: "eu-west-1"
  },
  server: {
    listenPort: 3000,                                           // The port on which the server is to listen (means that the app is at http://localhost:3000 for instance)
    securePort: 8433,                                           // The HTTPS port on which the server is to listen (means that the app is at https://localhost:8433 for instance)
    distFolder: '../client/app/',                               // The folder that contains the application files (note that the files are in a different repository) - relative to this file
    cookieSecret: 'QKTNrFTZzX4i3iKXoBjQuRdmZLoD'                // The secret for encrypting the cookie
  },
  postmark: {
    apikey: "",              // postmark api key
    from: "",                                // postmark signed from email addresss
    replyto: ""
  },
  api: {
    apiversion: "api/v1/"                                       // don't forget trailing slash
  },
  monitoring: {
    enabled: false,
    updateInterval: 1000,                                      // update custom monitor statistics every 1 seconds
    profile: {
      accountKey: '',
      appName: 'Development Application',
      debug: false
    }
  },
  logging: {
    using_logentries_service: false,
    logentries_token: '',
    level: 'silly',
    colorize: true
  }
};

module.exports = config;