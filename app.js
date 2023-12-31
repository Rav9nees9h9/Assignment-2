var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;//Google OAuth added to app.js
var mongoose = require('mongoose');
var configs = require('./configs/globals'); 
var User = require("./models/user");
var githubStrategy = require("passport-github2").Strategy;


var indexRouter = require('./routes/index');
var aboutRouter = require('./routes/about');
var assignmentsRouter = require('./routes/assignments');
var coursesRouter = require('./routes/courses');


var app = express();



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: "taskmanager", 
    resave: false, // forces the session to be saved back to the store even when not modified
    saveUninitialized: false,
  })
);

// configure passport
app.use(passport.initialize());
app.use(passport.session());
// configure passport strategy
passport.use(User.createStrategy()); // User.createStrategy() comes from plm (user.js)


// configure google oauth strategy
passport.use(new GoogleStrategy({
    clientID: configs.google.clientId,
    clientSecret: configs.google.clientSecret,
    callbackURL: configs.google.callbackUrl,
  },
  async (accessToken, refreshToken, profile, done) => {
    const user = await User.findOne({ googleId: profile.id });
      if (user) {
        return done(null, user);
      }
      else {
        const newUser = new User({
          username: profile.emails[0].value,
          googleId: profile.id,
          created: Date.now()
        });
        const savedUser = await newUser.save();
        return done(null, savedUser);
      }
  }
));

// configure github oauth strategy
passport.use(
  new githubStrategy(
    {
      clientID: configs.github.clientId,
      clientSecret: configs.github.clientSecret,
      callbackURL: configs.github.callbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await User.findOne({ oauthId: profile.id });
      if (user) {
        return done(null, user);
      }
      else {
        const newUser = new User({
          username: profile.username,
          oauthId: profile.id,
          oauthProvider: "GitHub",
          created: Date.now()
        });
        const savedUser = await newUser.save();
        return done(null, savedUser);
      }
    }
  )
);
// set passport to write/read user data to/from session object
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());

app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/assignments', assignmentsRouter);
app.use('/courses', coursesRouter);

// connect to the database
mongoose
  .connect(configs.db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((message) => {
    console.log("Database connection successfully!");
  })
  .catch((error) => {
    console.log(`Error while connecting! ${error}`);
  });

// HBS Helper Method to select values from dropdown lists
const hbs = require("hbs");

// function name and helper function with parameters
hbs.registerHelper("createOption", (currentValue, selectedValue) => {
  // initialize selected property
  var selectedProperty = "";
  // if values are equal
  if (currentValue == selectedValue) {
    selectedProperty = "selected";
  }

  return new hbs.SafeString(
    `<option ${selectedProperty}>${currentValue}</option>`
  );
});
// date formatter
// long date > Tue Jun 13 2023 20:00:00 GMT-0400 (Eastern Daylight Time)
hbs.registerHelper("toShortDate", (longDateValue) => {
  return new hbs.SafeString(longDateValue.toLocaleDateString("en-CA"));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
