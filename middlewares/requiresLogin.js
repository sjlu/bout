module.exports = function(req, res, next) {
  if (!req.user) return res.send(403, "Forbidden");
  next();
}