var config = {
  host: "https://reactureappdev-10669.onmodulus.net/",
  clienthost: "https://reactureappdev-10669.onmodulus.net/",
  mongo: {
    username: 'reactureapppdevonmodulus',
    password: 'T88XXE987987cfkKfits',
    dbName: 'reactureappdevonmodulus',                                // The name of database that contains the security information
    host: 'ds033679.mongolab.com:33679'                         // mongolab mongodb connection url
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
    distFolder: './clientapp/',                               // The folder that contains the application files (note that the files are in a different repository) - relative to this file
    cookieSecret: 'scMafaus3dfs4po03CrDAFd7fd45'                // The secret for encrypting the cookie
  },
  postmark: {
    apikey: "b1af3ea7-b17b-493c-a62c-53d3370a3077",              // postmark api key
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
    using_logentries_service: true,
    logentries_token: '8c496f2b-d0d9-4d67-a253-d0f6165e30ed',
    level: 'silly',
    colorize: true
  },
  cloudinary: {
    cloud_name: 'dqe7zmb1k',
    api_key: '619226866778758',
    api_secret: 'yA_Xv9LXc9aEab05M9YNlEgpQsw'
  },
  google: {
    apikey: "AIzaSyDeA3pWT15QSri8b00AVVqVCmAY_Niqbvg"
  },
  paymill: {
    PAYMILL_PRIVATE_KEY: '34e632de2eb8de9a92caea85fab7f380'
  },
  translations: {
    de: require('./clientapp/scripts/translations/locale-de.json'),
    en: require('./clientapp/scripts/translations/locale-en.json'),
    fr: require('./clientapp/scripts/translations/locale-fr.json'),
    it: require('./clientapp/scripts/translations/locale-it.json')
  }
};

module.exports = config;