const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    db = require('./db');

var User = {
    findById: function () {
        return { id: 1 }
    },
    findOne: function () {
        return { id: 1 }
    }
}

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        db.models.User.findOne({ username: username }).then(function (user) {
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
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