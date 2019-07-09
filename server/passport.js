const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    db = require('./db');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    db.models.User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
    usernameField: 'email'
}, function (email, password, done) {
    db.models.User.findOne({ email: email }).then(function (user) {
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        return user.comparePassword(password).then((correct) => {
            if (!correct) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        });
    }).catch(done);
}
));

module.exports = passport;