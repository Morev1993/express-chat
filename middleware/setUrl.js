module.exports = function(req, res, next) {
	res.locals.currentUrl = req.url;
	
	next();
}