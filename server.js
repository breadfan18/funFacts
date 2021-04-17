const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('passport');
const port = process.env.PORT || 3000;

// We'll need to load the env vars
require('dotenv').config();

// create the Express app
const app = express();

// connect to the MongoDB with mongoose
require('./config/database');

// Initialize oauth process for login requests by sumply running the code inside of ./config/passport.js
require('./config/passport');

// require our routes
const indexRoutes = require('./routes/index');
const studentsRoutes = require('./routes/students');

// view engine setup
app.set('view engine', 'ejs');

// Mount middleware
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// TODO Add session middleware here
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// TODO Add passport middleware here
app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRoutes);
app.use('/', studentsRoutes);



app.listen(port, () => {
  console.log(`Express is listening on port:${port}`);
});
