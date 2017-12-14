const express = require('express');

const router = express.Router();
const { requireLogin } = require('../middlewares/index');
/* GET home page. */
router.get('/', requireLogin, (req, res) => {
  res.render('index', { title: 'Express' });
});

module.exports = router;
