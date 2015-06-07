# token.js [![Build Status](https://travis-ci.org/flesch/token.js.png?branch=master)](https://travis-ci.org/flesch/token.js)

Simple Node utility to generate a random token including the ability to define the length.

## Installation

```
$ npm install token.js
```

## Example

```
var token = require('token.js');
console.log("Generate a 6 character token:", token());
console.log("Generate a 32 character token:", token(32));
```

