const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const promisify = require('es6-promisify');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const routes = require('./routes/index');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');

// create our Express app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views')); // this is the folder where we keep our pug files
app.set('view engine', 'pug'); // we use the engine pug, mustache or EJS work great too
console.log('view engine setup')

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'public')));
console.log('static files');

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
console.log('bodyParser')

// Exposes a bunch of methods for validating data. Used heavily on userController.validateRegister
app.use(expressValidator());
console.log('expressValidator');

// populates req.cookies with any cookies that came along with the request
app.use(cookieParser());
console.log('cookieParser');

// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages
// app.use(session({
//   secret: process.env.SECRET,
//   key: process.env.KEY,
//   resave: false,
//   saveUninitialized: false,
//   store: new MongoStore({ mongooseConnection: mongoose.connection })
// }));
// console.log('mongoose');

// // Passport JS is what we use to handle our logins
// app.use(passport.initialize());
// app.use(passport.session());
// console.log('passport');

// // // The flash middleware let's us use req.flash('error', 'Shit!'), which will then pass that message to the next page the user requests
// app.use(flash());
// console.log('flash');

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  // res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path !== undefined ? req.path : '';
  next();
});
console.log('pass variables to our templates + all requests');

// promisify some callback based APIs
app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});
console.log('promisify');

// After allllll that above middleware, we finally handle our own routes!
app.use('/', routes);
console.log('routes')

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);
console.log('notFound');

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);
console.log('flashValidationErrors');

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
  console.log('developmentErrors');
}

// production error handler
app.use(errorHandlers.productionErrors);
console.log('productionErrors');

// done! we export it so we can start the site in start.js
module.exports = app;
