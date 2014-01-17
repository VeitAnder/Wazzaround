var UAParser = require('ua-parser-js');
var parser = new UAParser();

var browser = {
  canHandleContentDisposition: function (useragentstring) {
    var result,
      isCapable = true;

    result = parser.setUA(useragentstring).getResult();

    console.log(result.browser);        // {name: "Chromium", major: "15", version: "15.0.874.106"}
    console.log(result.device);         // {model: undefined, type: undefined, vendor: undefined}
    console.log(result.os);             // {name: "Ubuntu", version: "11.10"}
    console.log(result.os.version);     // "11.10"
    console.log(result.engine.name);    // "WebKit"
    console.log(result.cpu.architecture);   // "amd64"

    // IE < 9
    if (result.browser.name === "IE" && result.browser.major < 9) {
      isCapable = false;
    }

    // Safari < 6 on Win and Mac
    if (result.browser.name === "Safari" && result.browser.major < 6) {
      isCapable = false;
    }

    // Safari 6 on OSX 10.7 or earlier !!
    if (result.browser.name === "Safari" && result.browser.major <= 6 && result.os.version.substr(3,1) < 8) {
      isCapable = false;
    }

    // Android Stock Browser
    if (result.browser.name === "Mobile Safari" && result.os.name === "Android" && result.browser.major <= 4) {
      isCapable = false;
    }

    return isCapable;
  }
};

module.exports = browser;