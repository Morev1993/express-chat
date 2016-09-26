var express = require('express');
var HttpError = require('error').HttpError;
var router = express.Router();
var mongoose = require('libs/mongoose');

var User = require('models/user').User;


router.get('/users', function(req, res, next) {
  User.find({}, function(err, users) {
    if (err) return next(err);

    res.json(users);
  })
});

router.get('/user/:id', function(req, res, next) {

	try {
		var id = mongoose.Types.ObjectId(req.params.id);
  } catch (e) {
    next(404);
    return;
  }
  User.findById(id, function(err, user) {
    if (err) return next(err);

    if (!user) {
    	return next(new HttpError(404, 'User not found'));
    }

    res.json(user);
  })
});

module.exports = router;
