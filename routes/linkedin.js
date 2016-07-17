var express = require("express");
var router = express.Router();
var User = require('./../models/users');

var config = require("./../config");

var passport = require("passport");
var LinkedInStrategy = require('passport-linkedin').Strategy;



// Passport needs to be able to serialize and deserialize users to support persistent login sessions
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    User.findByUserId(user.userId, function(err, user) {
        done(err, user);
    });
});

passport.use(new LinkedInStrategy(
    config.linkedin,
    function (token, tokenSecret, profile, cb) {
    User.findOrCreate(profile, function (err, user) {
      return cb(err, user);
    });
  }
));

router.get('/',
  passport.authenticate('linkedin', { scope: ['profile'] }));

router.get('/callback', 
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  function(req, res) {
    console.log(req.session);
    // Successful authentication, redirect home.
    res.redirect('/?user='+req.session.passport.user.userId + "&password="+req.session.passport.user.password);
  });

module.exports = router;
