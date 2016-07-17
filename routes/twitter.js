var express = require("express");
var router = express.Router();
var User = require('./../models/users');

var config = require("./../config");

var passport = require("passport");
var TwitterStrategy = require('passport-twitter').Strategy;



// Passport needs to be able to serialize and deserialize users to support persistent login sessions
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    User.findByUserId(user.userId, function(err, user) {
        done(err, user);
    });
});

passport.use(new TwitterStrategy(
    config.twitter,
    function (token, tokenSecret, profile, cb) {
    profile.provider = "twitter";
    User.findOrCreate(profile, function (err, user) {
      return cb(err, user);
    });
  }
));

router.get('/',
  passport.authenticate('twitter'));

router.get('/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    console.log(req.session);
    // Successful authentication, redirect home.
    res.render("redirect", {
      nasIpAddress: req.session.params.nasIpAddress,
      url: req.session.params.url,
      username: req.session.passport.user.userId,
      password: req.session.passport.user.password
    });
  });

module.exports = router;
