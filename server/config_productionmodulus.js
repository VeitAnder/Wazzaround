var config = {
  host: process.env.HOST, // "https://www.wazzaround.com/"
  clienthost: process.env.HOST_CLIENT, // "https://www.wazzaround.com/"
  mongo: {
    username: 'reactureapp',
    password: process.env.MONGODB_PASSWORD, // 'pDDbi6FYWsVUftsH9'
    dbName: 'reactureapp',                                // The name of database that contains the security information
    host: 'ds029780-a0.mongolab.com:29780,ds029780-a1.mongolab.com:29780',                         // mongolab mongodb connection url
    dumpHost : "ds029780-a0.mongolab.com:29780",
    readonlyuser : 'readonlyuser',
    readonlypass : process.env.MONGODB_PASSWORD_READONLY //'Kod:byT#Or[Zy.wel*her'
  },
  security: {
    usersCollection: 'users',                                   // The name of the collection contains user information
    passwordencryptionalgorithm: 'aes256',                      // db password encryption algorithm
    passwordencryptionkey: process.env.PASSWORD_ENCRYPTIONKEY // "EdJLil$§§&-kukk$ioi23a4t9T7"        // password encryptionkey
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
    distFolder: './client/dist/',                               // The folder that contains the application files (note that the files are in a different repository) - relative to this file
    cookieSecret: process.env.COOKIE_SECRET // 'scMaf5gs3dfs4po63CbDCFd78d45'                // The secret for encrypting the cookie
  },
  postmark: {
    apikey: process.env.POSTMARK_APIKEY, //"d15d835a-403a-4148-a63a-3d75aabd8ebf",              // postmark api key
    from: process.env.POSTMARK_FROM, //"admin@reacture.com",                                // postmark signed from email addresss
    replyto: process.env.POSTMARK_REPLYTO, //"donotreply@reacture.com"
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
    using_logentries_service: true,
    logentries_token: process.env.LOGENTRIES_TOKEN, //'1caba297-53b0-4970-ad67-5d6a6426336c',
    level: 'silly',
    colorize: true
  },
  cloudinary: {
    cloud_name: 'www-reacture-com',
    api_key: '162329319871877',
    api_secret: process.env.CLOUDINARY_API_SECRET, //'GKK3ipxXBqBrZPubVyjVRUQPhQc'
  },
  google: {
    apikey: process.env.GOOGLE_APIKEY //"AIzaSyDeA3pWT15QSri8b00AVVqVCmAY_Niqbvg"
  },
  paymill: {
    PAYMILL_PRIVATE_KEY: process.env.PAYMILL_PRIVATE_KEY, //'8b5c021ffff613bfd461c524c0caa41c'  // paymill private live key!
  },
  translations: {
    en: require('./client/dist/scripts/translations/locale-en.json'),
    fr: require('./client/dist/scripts/translations/locale-fr.json'),
    de: require('./client/dist/scripts/translations/locale-de.json'),
    it: require('./client/dist/scripts/translations/locale-it.json')
  }
};

module.exports = config;
