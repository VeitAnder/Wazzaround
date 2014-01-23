var Activities = require('../models/model_activities.js');

exports.findAll = function (req, res, next) {
  Activities.findQ({

  })
    .then(function (activities) {
      console.log("activities", activities);
      res.send(activities);
    })
    .fail(function (err) {
      console.log("err", err);
      next(err);
    })
    .done();
};
