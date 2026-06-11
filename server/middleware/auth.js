// Gate admin routes behind a logged-in session.
function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.redirect("/admin/login");
}

module.exports = { requireAuth };
