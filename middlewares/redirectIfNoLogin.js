module.exports = function(req, res, next) {
  if (!req.user) return res.redirect('/login?next=' + encodeURIComponent(req.url));
  next();
}