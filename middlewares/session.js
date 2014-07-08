module.exports = function(req, res, next) {
  if (!req.session.user) return res.send(403, "Forbidden");
}