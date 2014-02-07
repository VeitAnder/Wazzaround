'use strict';


// using the the Modelizer library
var model = require('modelizer');
var Attr = model.Attr;
var Type = model.Attr.Types;
var Ref = model.Ref;
var RefArray = model.RefArray;
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

  login : Operation,
  logout : Operation,
  register : Operation
});


var ActivityModel = new model("Activity", {
  name : Attr(Type.string),

  description : Attr(Type.string),
  images : Attr(Type.array),

  category : {
    main : Attr(Type.string),
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

  owner : Ref(ActivityModel)

});




var ProjectModel = new model("Project", {
  title : Attr(Type.string),

  participants : [{
    user : Ref(UserModel),
    roles : Attr(Type.array),
    permission : Attr(Type.string, Type.enum('owner', 'participant'))
  }]

});



if (typeof window === 'undefined') {
  // we don't run in a browser environment

  module.exports = {
    UserModel : UserModel,
    ProjectModel : ProjectModel
  };
}