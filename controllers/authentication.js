const User = require("../models/user");
const jwt = require("jwt-simple");
require("dotenv").config();

const tokenForUser = (user) => {
  // sub is subject
  //iat is issued at time
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.SECRET);
};

exports.signup = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).send({ message: "email and password are required" });
  }
  // See if a user with the given email exists
  User.findOne({ email: email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    // if a user with emal does exists, return an error

    if (existingUser) {
      return res.status(422).send({ error: "Email is in use" });
    }
    // if a user with email does not exist, create and save user record

    const user = new User({ email, password });
    user.save((err) => {
      if (err) {
        return next(err);
      }
      // Respond to request indicating the user was created

      res.json({ token: tokenForUser(user) });
    });
  });
};
exports.signin = (req, res, next) => {
  // User has already
  res.send({ token: tokenForUser(req.user) });
};
