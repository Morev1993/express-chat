var express = require('express');
var HttpError = require('error').HttpError;
var router = express.Router();
var mongoose = require('libs/mongoose');
var checkAuth = require('middleware/checkAuth')

var User = require('models/user').User;


router.get('/', function(req, res, next) {
  res.render('index', {title: 'Дочь прокурора'});
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}).then(function(user) {
  		if (user) {
  			console.log('Юзер существует: ' + user);
  			if (user.checkPassword(password)) {
  				console.log('Пароль верен');
  				req.session.user = user._id;
  				res.send(user);
	    	} else {
	    		return next(new HttpError(403, 'Пароль неверен'));
	    	}
  		} else {
  			var user = new User({username: username, password: password});

	    	user.save()
	    		.then(function() {
						req.session.user = user._id;
						res.send(user);

						console.log('save success');
	    		}, function(err) {
	    			return next(err);
	    		})
  		}
			
  	}, function(err) {
  		return next(err);
  	})
});


router.post('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
});

router.get('/chat', checkAuth, function(req, res, next) {
  res.render('chat');
});



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
