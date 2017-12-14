const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  contactEmail: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
  },

  balance: {
    type: Number,
    default: 0,
  },

});


// Save user's hashed password
UserSchema.pre('save', function doIt(next) {
  const user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      }

      bcrypt.hash(user.password, salt, () => {

      }, (err, hash) => {
        if (err) {
          return next(err);
        }
        // saving actual password as hash
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

// compare two password

UserSchema.methods.comparePassword = function comparePassword(pw, cb) {
  bcrypt.compare(pw, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
