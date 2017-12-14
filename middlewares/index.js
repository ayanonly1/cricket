const requireLogin = (req, res, next) => {
  if (!req.session.authenticated) {
    res.redirect('/account/logout');
  } else {
    next();
  }
};

module.exports = {
  requireLogin,
};

