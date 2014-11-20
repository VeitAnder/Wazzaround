var config = {
  host: "https://www.reacture.com/",
  clienthost: "https://www.reacture.com/",
  mongo: {
    username: 'reactureapp',
    password: 'pDDbi6FYWsVUftsH9',
    dbName: 'reactureapp',                                // The name of database that contains the security information
    host: 'ds029780-a0.mongolab.com:29780,ds029780-a1.mongolab.com:29780',                         // mongolab mongodb connection url
    dumpHost : "ds029780-a0.mongolab.com:29780",
    readonlyuser : 'readonlyuser',
    readonlypass : 'Kod:byT#Or[Zy.wel*her'
  },
  security: {
    usersCollection: 'users',                                   // The name of the collection contains user information
    passwordencryptionalgorithm: 'aes256',                      // db password encryption algorithm
    passwordencryptionkey: "EdJLil$§§&-kukk$ioi23a4t9T7"        // password encryptionkey
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
    distFolder: __dirname + '/clientapp/',                               // The folder that contains the application files (note that the files are in a different repository) - relative to this file
    cookieSecret: 'scMaf5gs3dfs4po63CbDCFd78d45'                // The secret for encrypting the cookie
  },
  postmark: {
    apikey: "d15d835a-403a-4148-a63a-3d75aabd8ebf",              // postmark api key
    from: "admin@reacture.com",                                // postmark signed from email addresss
    replyto: "donotreply@reacture.com"
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
    cloud_name: 'www-reacture-com',
    api_key: '162329319871877',
    api_secret: 'GKK3ipxXBqBrZPubVyjVRUQPhQc'
  },
  google: {
    apikey: "AIzaSyDeA3pWT15QSri8b00AVVqVCmAY_Niqbvg"
  },
  paymill: {
    PAYMILL_PRIVATE_KEY: '8b5c021ffff613bfd461c524c0caa41c'  // paymill private live key!
  },
  translations: {
    de: require(__dirname + '/clientapp/scripts/translations/locale-de.json'),
    en: require(__dirname + '/clientapp/scripts/translations/locale-en.json'),
    fr: require(__dirname + '/clientapp/scripts/translations/locale-fr.json'),
    it: require(__dirname + '/clientapp/scripts/translations/locale-it.json')
  }
};

module.exports = config;
