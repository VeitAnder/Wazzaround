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
    username: 'reactureappdev',
    password: 'pGjRLG72qvXBGo',
    dbName: 'reactureappdev',                                // The name of database that contains the security information
    host: 'ds027419.mongolab.com:27419'                         // mongolab mongodb connection url
//    url : 'mongodb://127.0.0.1/reacturelocal'
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
  postmark: {  // TODO remove planfred data and generate reacture date
    apikey: "e5d214d4-f56b-4c2d-9c76-eaf16bccebcf",              // postmark api key
    from: "kontakt@planfred.com",                                // postmark signed from email addresss
    replyto: "noreply@planfred.com"
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
  },
  cloudinary: {
    cloud_name: 'dqe7zmb1k',
    api_key: '619226866778758',
    api_secret: 'yA_Xv9LXc9aEab05M9YNlEgpQsw'
  }
};

module.exports = config;