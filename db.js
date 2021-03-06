"use strict";

let co = require('co');
let mongoose = require('libs/mongoose');

mongoose.set('debug', true);

function open() {
	return new Promise((resolve, reject) => mongoose.connection.once('open', resolve) );
}

function dropDb() {
	return new Promise((resolve, reject) => mongoose.connection.db.dropDatabase(resolve) );
}

function* createUsers() {
	let User = require('./models/user').User;

	yield new Promise((resolve, reject) => mongoose.models.User.on('index', resolve));

	let userPromises = [
	    { username: "Admin", password: "secret1" }
  	].map(userData => {
	    let user = new User(userData);
	    return user.save();
  	});

  	let users = yield Promise.all(userPromises);

	return users;
}

function closeDb() {
	mongoose.disconnect();
	return Promise.resolve();
}

co(function *() {
	try {
		yield open();
		yield dropDb();
		let users = yield* createUsers();
		console.log(users);
	} catch(e) {
		throw e;
	} finally {
		yield closeDb();
	}

	return "Done";
}).then(value => console.log("result is " + value), err => console.log(err.stack));