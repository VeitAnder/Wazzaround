'use strict';


// using the the Modelizer library
var model = require('modelizer');
//var model = require('../../../../modelizer/lib/modelizer.js');

var Attr = model.Attr;
var Type = model.Attr.Types;
var Ref = model.Ref;
var Operation = model.Operation;



var UserModel = new model("User", {
  email : Attr(Type.string),
  password : Attr(Type.string),

  profile : {
    firstName : Attr(Type.string),
    lastName : Attr(Type.string),
    company : Attr(Type.string),
    address : Attr(Type.string),
    location : {
      longitude: Attr(Type.string),
      latitude: Attr(Type.string)
    }
  },

  login : Operation(/*{
    params: {
      username : Attr(Type.string),
      password : Attr(Type.string)
    }
  }*/),
  logout : Operation(),
  register : Operation(/*{
    params: {
      username : Attr(Type.string),
      password : Attr(Type.string)
    }
  }*/)
});


var ActivityModel = new model("Activity", {
  name : Attr(Type.string),

  description : Attr(Type.string),
  images : Attr(Type.array),

  category : {
    main : Attr(Type.string, Type.enum('sports', 'culture', 'wellness')),
    sub : Attr(Type.string)
  },

  location : {
    longitude: Attr(Type.string),
    latitude: Attr(Type.string)
  },

  availability : {
    start : Attr(Type.string),
    end : Attr(Type.string)
  },

  owner : Ref(UserModel)

});

// TODOs categories model



if (typeof window === 'undefined') {
  // we don't run in a browser environment

  module.exports = {
    UserModel : UserModel,
    ActivityModel : ActivityModel
  };
}