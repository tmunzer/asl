var express = require("express");
var router = express.Router();
var User = require('./../models/users');

var config = require("./../config");

var passport = require("passport");
var GoogleStrategy = require('passport-google-oauth20').Strategy;
  // Passport needs to be able to serialize and deserialize users to support persistent login sessions
  passport.serializeUser(function(user, done) {
      done(null, user);
  });

  passport.deserializeUser(function(user, done) {
      User.findByUserId(user.userId, function(err, user) {
          done(err, user);
      });
  });


passport.use(new GoogleStrategy(
    config.google,
    function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate(profile, function (err, user) {
            return cb(err, user);
    });
  }
  ));

router.get('/',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    console.log(req.session);
    // Successful authentication, redirect home.
    res.redirect('/?user='+req.session.passport.user.userId + "&password="+req.session.passport.user.password);
  });

module.exports = router;
