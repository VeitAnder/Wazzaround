/**
 * NodeJs Server-Side Example for Fine Uploader S3.
 * Maintained by Widen Enterprises.
 *
 * This example:
 *  - handles non-CORS environments
 *  - handles delete file requests assuming the method is DELETE
 *  - Ensures again the file size does not exceed the max (after file is in S3)
 *  - signs policy documents (simple uploads) and REST requests
 *    (chunked/multipart uploads)
 *
 * Requirements:
 *  - express 3.3.5+ (for handling requests)
 *  - crypto 0.0.3+ (for signing requests)
 *
 */

var config = require('../config.js'),
  crypto = require("crypto"),
  clientSecretKey = config.amazons3.S3_SECRET_KEY,

// These two keys are only needed if you plan on using the AWS SDK
//  serverPublicKey = config.amazons3.S3_ACCESS_KEY,
//  serverSecretKey = config.amazons3.S3_SECRET_KEY,

// Set these two values to match your environment
  expectedBucket = config.amazons3.S3_BUCKET_NAME,
  expectedMaxSize = 1073741824,  //1GB - has to match value set in client directive s3fineuploadform.js

  signRestRequest,
  signRequest,
  signPolicy,
  isValidRestRequest,
  isPolicyValid;
// Handles all signature requests and the success request FU S3 sends after the file is in S3
// You will need to adjust these paths/conditions based on your setup.

// Signs multipart (chunked) requests.  Omit if you don't want to support chunking.
signRestRequest = function(req, res) {
  var stringToSign = req.body.headers,
    signature = crypto.createHmac("sha1", clientSecretKey)
      .update(stringToSign)
      .digest("base64");

  var jsonResponse = {
    signature: signature
  };

  res.setHeader("Content-Type", "application/json");

  if (isValidRestRequest(stringToSign)) {
    res.end(JSON.stringify(jsonResponse));
  }
  else {
    res.status(500);
    res.end(JSON.stringify({invalid: true}));
  }
};

// Signs any requests.  Delegate to a more specific signer based on type of request.
signRequest = function(req, res) {
  if (req.body.headers) {
    signRestRequest(req, res);
  }
  else {
    signPolicy(req, res);
  }
};

// Signs "simple" (non-chunked) upload requests.
signPolicy = function(req, res) {
  var base64Policy = new Buffer(JSON.stringify(req.body)).toString("base64"),
    signature = crypto.createHmac("sha1", clientSecretKey)
      .update(base64Policy)
      .digest("base64");

  var jsonResponse = {
    policy: base64Policy,
    signature: signature
  };

  res.setHeader("Content-Type", "application/json");

  if (isPolicyValid(req.body)) {
    res.end(JSON.stringify(jsonResponse));
  }
  else {
    res.status(500);
    res.end(JSON.stringify({invalid: true}));
  }
};

// Ensures the REST request is targeting the correct bucket.
// Omit if you don't want to support chunking.
isValidRestRequest = function(headerStr) {
  return new RegExp("\/" + expectedBucket + "\/.+$").exec(headerStr) !== null;
};

// Ensures the policy document associated with a "simple" (non-chunked) request is
// targeting the correct bucket and the max-size is as expected.
// Omit the parsedMaxSize-related code if you don't have a max file size.
isPolicyValid = function(policy) {
  var bucket, parsedMaxSize;

  policy.conditions.forEach(function (condition) {
    console.log("condition", condition);
    if (condition.bucket) {
      bucket = condition.bucket;
    }
    else if (condition instanceof Array && condition[0] === "content-length-range") {
      parsedMaxSize = condition[2];
    }
  });

  return bucket === expectedBucket && parsedMaxSize === expectedMaxSize.toString();
};

exports.s3handler = function (req, res) {
  "use strict";
  signRequest(req, res);
};