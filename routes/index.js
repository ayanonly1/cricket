const express = require('express');

const router = express.Router();
const { requireLogin } = require('../middlewares/index');
const User = require('../models/User');
/* GET home page. */
router.get('/', requireLogin, (req, res) => {
  const userId = req.session.user.id;
  User.findById(userId, (err, user) => {
    if (err) {
      res.status(503).send('Sorry!');
    }
    res.render('index', user);
  });
});

module.exports = router;
