var config = require('../config.js');

var crypto = require('crypto');

/*
 fork of https://github.com/dyashkir/amazon-s3-url-signer
 */

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
var encodeRFC5987ValueChars = function (str) {
  "use strict";

  return encodeURIComponent(str).
    // Note that although RFC3986 reserves "!", RFC5987 does not, so we do not need to escape it
    replace(/['()]/g, escape). // i.e., %27 %28 %29
    replace(/\*/g, '%2A').
    // The following are not required for percent-encoding per RFC5987, so we can allow for a little better readability over the wire: |`^
    replace(/%(?:7C|60|5E)/g, unescape);
};

var S3UrlSigner = function (key, secret, options) {
  "use strict";
  var endpoint,
    hmacSha1,
    url;

  endpoint = options.host;
  hmacSha1 = function (message) {
    return crypto.createHmac('sha1', secret)
      .update(message)
      .digest('base64');
  };

  url = function (fname) {
    return endpoint + (fname[0] === '/' ? '' : '/') + fname;
  };

  return {
    getUrl: function (verb, fname, bucket, expiresInMinutes, downloadAsAttachment, filename) {
      var expires = new Date();
      expires.setMinutes(expires.getMinutes() + expiresInMinutes);
      var epo = Math.floor(expires.getTime() / 1000);
      var str,
        hashed,
        urlRet,
        responseContentDisposition,
        responseContentDispositionUrlParameter;

      // @TODO - implement ASCII filename encoding for IE8/Android Browser

      if (downloadAsAttachment && filename) {
        responseContentDisposition = "?response-content-disposition=attachment; filename=" + encodeRFC5987ValueChars(filename);
        responseContentDispositionUrlParameter = "&response-content-disposition=attachment; filename=" + encodeURIComponent(encodeRFC5987ValueChars(filename));
      } else if (downloadAsAttachment && filename === undefined) {
        responseContentDisposition = "?response-content-disposition=attachment;";
        responseContentDispositionUrlParameter = "&response-content-disposition=attachment;";
      } else if (!downloadAsAttachment && filename) {
        responseContentDisposition = "?response-content-disposition=inline; filename=" + encodeRFC5987ValueChars(filename);
        responseContentDispositionUrlParameter = "&response-content-disposition=inline; filename=" + encodeURIComponent(encodeRFC5987ValueChars(filename));
      } else {
        // let the browser handle the download as attachment via the content disposition header sent from S3
        responseContentDisposition = "";
        responseContentDispositionUrlParameter = "";
      }

      str = verb + "\n\n\n" + epo + "\n" + "/" + bucket + (fname[0] === "/" ? "" : "/") + fname + responseContentDisposition;
      hashed = hmacSha1(str);

      urlRet = url(fname) +
        "?Expires=" + epo +
        "&AWSAccessKeyId=" + key +
        "&Signature=" + encodeURIComponent(hashed) +
        responseContentDispositionUrlParameter;

      return urlRet;
    }
  };
};

exports.getSignedDownloadUrl = function (key, downloadAsAttachment, filename) {
  "use strict";

  var signer,
    url;

  signer = new S3UrlSigner(config.amazons3.S3_ACCESS_KEY, config.amazons3.S3_SECRET_KEY, { host: config.amazons3.S3_BUCKET_URL});
  url = signer.getUrl('GET', key, config.amazons3.S3_BUCKET_NAME, 1, downloadAsAttachment, filename); //url expires in 1 minute
  return url;
};