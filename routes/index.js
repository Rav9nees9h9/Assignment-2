var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

/* GET home page. */
router.get("/", function (req, res, next) {
  // view name is relative to the /views folder
  res.render("index", { title: "Task Manager", user: req.user });
});

// GET handler for /login
router.get("/login", (req, res, next) => {
  // retrieve the messages
  let messages = req.session.messages || [];
  // clear messages from session
  req.session.messages = [];
  // send messages to view
  res.render("login", { title: "Login to your Account", messages: messages });
});
// POST handler for /login
router.post(
  "/login",
  passport.authenticate(
    "local", 
    {
      successRedirect: "/projects",
      failureRedirect: "/login",
      failureMessage: "Invalid Credentials", // error if credentials are incorrect
    }
  )
);

// GET handler for /register
router.get("/register", (req, res, next) => {
  res.render("register", { title: "Create a new Account" });
});

// POST handler for /register
router.post("/register", (req, res, next) => {
  User.register(
    {
      username: req.body.username,
    },
    req.body.password,
    (err, newUser) => {
      if (err) {
        console.log(err);
        return res.redirect("/register");
      } else {
        req.login(newUser, (err) => {
          res.redirect("/assignments");
        });
      }
    }
  );
});

// GET handler for /logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    res.redirect("/login");
  });
});

// GET handler for /github
// user gets sent to GitHub.com to enter their credentials
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user.email"] })
);

// GET handler for /github/callback
// user is sent back from github.com after authenticating
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res, next) => {
    res.redirect("/assignments");
  }
);
// GET handler for /google
// user are asked to enter their credentials, like email id
router.get(
  "/google",
  passport.authenticate("google", {scope: ["email"]})
);

// GET handler for /google/callback
// user is sent back after authenticating
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res, next) => {
    res.redirect("/");
  }

);



module.exports = router;
