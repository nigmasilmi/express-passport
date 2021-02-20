const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const LocalStrategy = require("passport-local");
require("dotenv").config();

// create local strategy
const localOptions = { usernameField: "email" };
const localLogin = new LocalStrategy(
  localOptions,
  function (email, password, done) {
    // verify email and password are correct
    // call done the same way as signup
    User.findOne({ email }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      // compare passwords
      user.comparePassword(password, function (err, isMatch) {
        if (err) {
          return done(err);
        }
        if (!isMatch) {
          return done(null, false);
        }
        return done(null, user);
      });
    });
  }
);
// Setup options for JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: process.env.SECRET,
};

// Create JWT Strategy
// payload is the jwt decoded token
// done is a callback function that we call depending on if the user is authenticated or not
// if it is positive, call done with the user object, and negative call done without user object
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  User.findById(payload.sub, function (err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});
// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
