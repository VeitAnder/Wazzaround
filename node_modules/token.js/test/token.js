var token = require('../'),
    assert = require('assert');
    

describe('token', function(){
  
  describe('collision', function(){
    it('should create unique tokens', function(){
      assert.notEqual(token(6), token(6));
    });
  });
  
  describe('length', function(){
    it('should create a token with 32 characters', function(){
      assert.equal(token(32).length, 32);
    });
  });

});