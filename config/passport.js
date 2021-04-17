const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const Student = require('../models/student');

// passport.use <-- this is what we use to plug-in login options 
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
}, function (accessToken, refreshToken, profile, cb) {
    // at this point, a user has attempted a login, and now we can do the following
    // check if this user already exist in our database? 
    Student.findOne({
        googleId: profile.id
    }, function (err, student) {
        // if they don't we create them 
        if (err) return cb(err);

        // if student exists in our database, log them in..
        if (student) {
            return cb(null, student);
        } else {
            // if student doesn't exist, create them instead
            const newStudent = new Student({
                name: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                avatarURL: profile.photos[0].value
            });
            newStudent.save(function (err) {
                if (err) return cb(err);
                // at this point, student/user is saved successfully
                return cb(null, newStudent);
            })
        }

    })
}))


// passport.serializeUser <-- this gets called one time when the user logs in to create a session
passport.serializeUser(function (student, done) {
    done(null, student.id);
});

// passport.deserializeUse <-- this gets called with each request, and it decodes the cookie and looks up the user in the session store
passport.deserializeUser(function (id, done) {
    Student.findById(id, function (err, student) {
        done(err, student); // creates req.user
    });
})