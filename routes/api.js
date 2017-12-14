const express = require('express');
const jwt  = require('jsonwebtoken');
const config = require('../config/index');
const User = require('../models/User');

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

module.exports = router;
