const router = require('express').Router();
const passport = require('passport');
const { route } = require('./students');

router.get('/', function(req, res) {
  res.render('index', {
    user: req.user
  });
});

// login route
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// callback route - called back/reuested after user logs in
router.get('/oauth2callback', passport.authenticate('google', {
  successRedirect: '/students',
  failureRedirect: '/' 
}));

// logout route
router.get('/logout', function (req, res) {
  req.logOut(); //destroy the login session from session storage
  res.redirect('/'); //send the user back to the home page
})
module.exports = router;