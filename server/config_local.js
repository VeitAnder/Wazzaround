var config = {
  host: "http://localhost:3000/",
  clienthost: "http://localhost:9000/",
  mongo: {
    local: true,
    host: 'localhost',
    dbName: 'reactureappdev'                                // The name of database that contains the security information
  },
  security: {
    usersCollection: 'users',                                   // The name of the collection contains user information
    passwordencryptionalgorithm: 'aes256',                      // db password encryption algorithm
    passwordencryptionkey: "EdJkKl$§$&-kjlk$ioi23a4t9T7",        // password encryptionkey
    switchToHttps: "false"
  },
  server: {
    listenPort: 3000,                                           // The port on which the server is to listen (means that the app is at http://localhost:3000 for instance)
    securePort: 8433,                                           // The HTTPS port on which the server is to listen (means that the app is at https://localhost:8433 for instance)
    distFolder: '../client/app/',                               // The folder that contains the application files (note that the files are in a different repository) - relative to this file
    cookieSecret: 'QKTNrFTZzX4i3iKXoBjQuRdmZLoD'                // The secret for encrypting the cookie
  },
  postmark: {
    apikey: "b1af3ea7-b17b-493c-a62c-53d3370a3077",              // postmark api key
    from: "admin@wazzaround.com",                                 // postmark signed from email addresss
    replyto: "donotreply@wazzaround.com",
    bcc: "ms@anorak.io"
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
    api_key: '352462286589814',
    api_secret: 'hg2e2FKLKwTYsboxYNtQUYRwEwI'
  },
  google: {
    apikey: "AIzaSyD-bZExsAXqT0ZyfFdjt7rxpuF8xmD5gZQ"
  },
  paymill: {
    PAYMILL_PRIVATE_KEY: '34e632de2eb8de9a92caea85fab7f380'
  },
  translations: {
    de: require('../client/app/scripts/translations/locale-de.json'),
    en: require('../client/app/scripts/translations/locale-en.json'),
    fr: require('../client/app/scripts/translations/locale-fr.json'),
    it: require('../client/app/scripts/translations/locale-it.json')
  }
};

module.exports = config;