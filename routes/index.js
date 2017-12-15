const express = require('express');

const router = express.Router();
const { requireLogin } = require('../middlewares/index');
const User = require('../models/User');
const Question = require('../models/Question');
const Bet = require('../models/Bet');
const { isDisabled } = require('../config/index');

/* GET home page. */
router.get('/', requireLogin, (req, res) => {
  const userId = req.session.user.id;
  User.findById(userId, (err, user) => {
    if (err) {
      res.status(503).send('Sorry!');
    }
    Question.find({}, (err, questions) => {
      if (err) {
        res.status(503).send('Sorry!');
      }

      Bet.find({ user_id: userId }, (err, bets) => {
        if (err) {
          res.status(503).send('Sorry!');
        }
        res.render('index', {
          user, questions, bets, isDisabled,
        });
      });
    });
  });
});


module.exports = router;
