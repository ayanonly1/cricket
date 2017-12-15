const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config/index');

// models
const User = require('../models/User');
const Question = require('../models/Question');
const Bet = require('../models/Bet');

const {
  requireLogin,
} = require('../middlewares/index');

const router = express.Router();
/* Authenticate the user and reply back with a payload */
router.post('/auth', (req, res) => {
  if (!req.body.contactEmail || !req.body.password) {
    return res.json({
      error: 'true',
      message: 'Invalid Details',
    });
  }
  User.findOne({
    contactEmail: req.body.contactEmail,
  }, (err, user) => {
    if (err) {
      throw err;
    }
    if (!user) {
      res.json({
        error: 'true',
        message: 'You are not registered',
      });
    } else {
      // password checking
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          const payload = {
            id: user._id,
            name: user.name,
            contactEmail: user.contactEmail,
          };

          req.session.user = payload;
          req.session.authenticated = true;
          const token = jwt.sign(payload, config.secret, {
            expiresIn: 3600 * 24 * 30, // in seconds
          });
          return res.json({
            error: 'false',
            message: 'Successfully Authenticated',
            token,
            server_timestamp: (new Date()).toISOString(),
          });
        }
        // password does not match
        res.json({
          error: 'true',
          message: 'Failed to authenticate',
        });
      });
    }
  });
});

/* Register for a new user */
router.post('/register', (req, res) => {
  const user = new User(req.body);
  user.save((err) => {
    if (err) {
      console.log(err);
      return res.json({
        error: true,
        message: err.errors,
      });
    }
    res.json({
      error: false,
      data: {
        id: user.id,
      },
    });
  });
});


router.post('/question/add', (req, res) => {
  const questionDescription = req.body.question;
  if (!questionDescription) {
    return res.json({
      error: true,
    });
  }
  const question = new Question({
    description: questionDescription,
  });
  question.save((err) => {
    if (err) {
      return res.json({
        error: true,
      });
    }
    res.json({
      error: false,
      data: question,
    });
  });
});

router.get('/question', requireLogin, (req, res) => {
  Question.find({}, (err, questions) => {
    if (err) {
      return res.json({
        error: true,
      });
    }
    res.json({
      error: false,
      data: questions,
    });
  });
});


router.post('/bet', requireLogin, (req, res) => {
  const user_id = req.session.user.id;
  const question_id = req.body.question_id;
  const amount = req.body.amount;
  if (amount < 0) {
    return res.json({
      error: true,
      message: 'Do not be so negative',
    });
  }
  const opinion = req.body.opinion === 'true';
  console.log(opinion);
  User.findById(user_id, (err, user) => {
    if (err) {
      return res.json({
        error: true,
        message: err.toString(),
      });
    }

    if (user.balance <= amount) {
      return res.json({
        error: true,
        message: 'Not sufficient balance',
      });
    }

    // deduct balance from user
    User.findOneAndUpdate({
      _id: user_id,
    }, {
      $set: {
        balance: (user.balance - amount),
      },
    }, {
      new: true,
    }, (err) => {
      if (err) {
        return res.json({
          error: true,
          message: err.toString(),
        });
      }

      Bet.find({ user_id, question_id }, (err, bet) => {
        if (bet && bet.length) {
          return res.json({ error: true });
        }
        const betS = new Bet({
          user_id,
          question_id,
          amount,
          opinion,
        });
        betS.save((err) => {
          if (err) {
            return res.json({
              error: true,
            });
          }
          res.json({
            error: false,
            data: betS,
          });
        });
      });
    });
  });
});

router.get('/bet/:question_id', (req, res) => {
  const question_id = req.params.question_id;
  let forOp = 0;
  let aginstOp = 0;
  Bet.find({ question_id }, (err, bets) => {
    if (err) {
      return res.json({
        error: true,
        message: err.toString(),
      });
    }
    bets.forEach((bet) => {
      if (bet.opinion) {
        forOp += bet.amount;
      } else {
        aginstOp += bet.amount;
      }
    });
    return res.json({
      error: false,
      data: {
        forOp, aginstOp,
      },
    });
  });
});

module.exports = router;
