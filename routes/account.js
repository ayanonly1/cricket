const express = require('express');

const router = express.Router();

router.get('/login', (req, res) => {
  if (req.session.authenticated) { return res.redirect('/'); }
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.all('/logout', (req, res) => {
  req.session.authenticated = false;
  req.session.user = null;
  res.redirect('/account/login');
});


module.exports = router;
