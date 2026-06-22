function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    req.flash("error", "Faça login para continuar.");
    return res.redirect("/login");
  }
  next();
}

function isAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== "admin") {
    req.flash("error", "Acesso permitido apenas para administrador.");
    return res.redirect("/login");
  }
  next();
}

function isClient(req, res, next) {
  if (!req.session.user || req.session.user.role !== "cliente") {
    req.flash("error", "Acesso permitido apenas para clientes.");
    return res.redirect("/login");
  }
  next();
}

module.exports = { isAuthenticated, isAdmin, isClient };
