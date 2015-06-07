function token(n){
  var salt = 'abcdefghijklmnopqrstuvwxyz0123456789', key = '', len = n || 6, length = salt.length, i = 0;
  if (length < len) {
    while(salt.length < len) {
      salt += salt;
    }
    length = salt.length;
  }
  for (; i<len; key+=salt.charAt(Math.floor(Math.random()*length)), i++);
  return key;
}

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = token;
  }
  exports.token = token;
} else {
  this.token = token;
}