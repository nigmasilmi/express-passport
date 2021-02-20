const passportService = require("./services/passport");
const passport = require("passport");

// between incoming request and route
// session is a cookie based session, in this case is false because
// we are not using cookies but tokens
const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

const Authentication = require("./controllers/authentication");
module.exports = (app) => {
  app.get("/", requireAuth, (req, res) => {
    res.send("hi you got in");
  });
  app.post("/signup", Authentication.signup);
  app.post("/signin", requireSignin, Authentication.signin);
};
