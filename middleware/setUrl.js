module.exports = function(req, res, next) {
	res.locals.currentUrl = req.url;
	console.log(req.url);

	next();
}