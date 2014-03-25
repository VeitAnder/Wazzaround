var fs = require("fs");

var jsonTest = require('./jsontest.json');

fs.appendFileSync("./csvoutput.csv", "[ \n");

var countlines = 0;
for (var key in jsonTest) {
  countlines++;
}

for (var key in jsonTest) {
//  if (jsonTest.hasOwnProperty(key)) {
//    console.log("KEY", key);
//    console.log("VAL", jsonTest[key]);
  fs.appendFileSync("./csvoutput.csv", "{\"key\" : \"" + key + "\", \"translation\" : \"" + jsonTest[key] + "\"}");

  countlines--;

  if (countlines > 0) {
    fs.appendFileSync("./csvoutput.csv", ",\n");
  }
  else {
    fs.appendFileSync("./csvoutput.csv", "\n");
  }

//  }
}

fs.appendFileSync("./csvoutput.csv", "]\n");
