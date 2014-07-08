module.exports = function(req, res, next) {
  if (!req.session.uid) return res.send(403, "Forbidden");
  next();
}