var login = require('./login');
var User = require('./../models/users');

module.exports = function(passport){



passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);

};