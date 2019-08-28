const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    mongoose.model('User').findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    session: true
}, function (email, password, done) {
    mongoose.model('User').findOne({ email: email }).then(function (user) {
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