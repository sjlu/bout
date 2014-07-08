var mongoose = require('../lib/mongoose');
var bcrypt = require('bcrypt');

var User = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  username: {
    type: String,
    require: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  },
  withings: {
    nested: {
      id: {
        type: Number,
        required: true
      },
      token: {
        type: String,
        required: true
      },
      secret: {
        type: String,
        required: true
      }
    }
  }
});

User.pre('save', function(next) {
  var self = this;

  if (!this.isModified('password')) return next();

  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(self.password, salt, function(err, hash) {
      if (err) return next(err);

      self.password = hash;
      next();
    });
  });
});

User.methods.authenticate = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, match) {
    if (err) return cb(err);
    cb(null, match);
  });
}

module.exports = mongoose.model('User', User);