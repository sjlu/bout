var mongoose = require('../lib/mongoose');
var bcrypt = require('bcrypt');
var md5 = require('MD5');
var textSearch = require('mongoose-text-search');
var mongooseValidator = require('mongoose-validator');
var _ = require('lodash');

var User = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    index: {
      unique: true
    }
  },
  username: {
    type: String,
    lowercase: true,
    trim: true,
    require: true,
    index: {
      unique: true
    },
    validate: mongooseValidator({
      validator: 'isAlphanumeric',
      passIfEmpty: false,
      message: "Username can only be alpha-numeric"
    })
  },
  first_name: {
    type: String,
    trim: true
  },
  last_name: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  withings_id: {
    type: Number
  },
  withings_token: {
    type: String
  },
  withings_secret: {
    type: String
  },
  jawbone_id: {
    type: String
  },
  jawbone_token: {
    type: String
  },
  fitbit_id: {
    type: String
  },
  fitbit_token: {
    type: String
  },
  fitbit_secret: {
    type: String
  },
  calorie_target: {
    type: Number
  }
});

User.plugin(textSearch);
User.index({username: 'text'});

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

User.methods.updateInfo = function(fields, cb) {
  var self = this;

  var updatableFields = [
    "first_name",
    "last_name",
    "calorie_target"
  ];

  fields = _.pick(fields, updatableFields);
  _.each(fields, function(value, field) {
    self[field] = value;
  });

  self.save(cb);
}

User.statics.searchForUser = function(input, cb) {
  this.find({
    "username": new RegExp(".*"+input+".*")
  }, cb);
}

User.method('toJSON', function() {
  var user = this.toObject({virtuals: true});
  delete user.password;
  delete user.withings_id;
  delete user.withings_token;
  delete user.withings_secret;
  delete user.jawbone_id;
  delete user.jawbone_token;
  delete user.fitbit_id;
  delete user.fitbit_token;
  delete user.fitbit_secret;
  return user;
});

User.virtual('gravatar').get(function() {
  return 'https://www.gravatar.com/avatar/' + md5(this.email) + '.jpg';
});

User.virtual('has_fitbit').get(function() {
  if (this.fitbit_id) {
    return true;
  }

  return false;
});

User.virtual('has_withings').get(function() {
  if (this.withings_id) {
    return true;
  }

  return false;
});

User.virtual('has_jawbone').get(function() {
  if (this.jawbone_token) {
    return true;
  }

  return false;
});

User.virtual('has_tracker').get(function() {
  if (this.jawbone_token || this.fitbit_id || this.withings_id) {
    return true;
  }

  return false;
});

User.virtual('name').get(function() {
  return this.first_name + " " + this.last_name;
});

module.exports = mongoose.model('User', User);