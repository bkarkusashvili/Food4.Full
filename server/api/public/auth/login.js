const passport = require('passport');

module.exports = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) { return res.status(500).json(err); }
        if (!user) { return res.status(401).json(info.message); }
        req.logIn(user, function (err) {
            if (err) { return res.status(500).json(err); }

            if (req.body.remember) {
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
            } else {
                req.session.cookie.expires = false; // Cookie expires at end of session
            }

            return res.json(user);
        });
    })(req, res, next);
};