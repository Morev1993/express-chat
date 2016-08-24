var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var Cat = mongoose.model('Cat', { name: String });

Cat.find({}, function (err, cats) {
	console.log(cats);
})