var config = {
  host: process.env.HOST,
  clienthost: process.env.HOST_CLIENT,
  mongo: {
    username: 'reactureapp',
    password: process.env.MONGODB_PASSWORD,
    dbName: 'reactureapp',                                // The name of database that contains the security information
    host: 'ds029780-a0.mongolab.com,ds029780-a1.mongolab.com',                         // mongolab mongodb connection url
    port: 29780,
    dumpHost: "ds029780-a0.mongolab.com:29780",
    readonlyuser: 'readonlyuser',
    readonlypass: process.env.MONGODB_PASSWORD_READONLY
  },
  security: {
    usersCollection: 'users',                                   // The name of the collection contains user information
    passwordencryptionalgorithm: 'aes256',                      // db password encryption algorithm
    passwordencryptionkey: process.env.PASSWORD_ENCRYPTIONKEY,  // password encryptionkey
    switchToHttps: process.env.SWITCH_TO_HTTPS
  },
  server: {
    listenPort: 3000,                                           // The port on which the server is to listen (means that the app is at http://localhost:3000 for instance)
    securePort: 8433,                                           // The HTTPS port on which the server is to listen (means that the app is at https://localhost:8433 for instance)
    distFolder: './client/dist/',                               // The folder that contains the application files (note that the files are in a different repository) - relative to this file
    cookieSecret: process.env.COOKIE_SECRET            // The secret for encrypting the cookie
  },
  postmark: {
    apikey: process.env.POSTMARK_APIKEY,             // postmark api key
    from: process.env.POSTMARK_FROM,                           // postmark signed from email addresss
    replyto: process.env.POSTMARK_REPLYTO,
    bcc: process.env.POSTMARK_BCC
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
    logentries_token: process.env.LOGENTRIES_TOKEN,
    level: 'silly',
    colorize: true
  },
  cloudinary: {
    cloud_name: 'www-reacture-com',
    api_key: '162329319871877',
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  google: {
    apikey: process.env.GOOGLE_APIKEY
  },
  paymill: {
    PAYMILL_PRIVATE_KEY: process.env.PAYMILL_PRIVATE_KEY // paymill private live key!
  },
  translations: {
    en: require('../client/dist/scripts/translations/locale-en.json'),
    fr: require('../client/dist/scripts/translations/locale-fr.json'),
    de: require('../client/dist/scripts/translations/locale-de.json'),
    it: require('../client/dist/scripts/translations/locale-it.json')
  }
};

module.exports = config;
