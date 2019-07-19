const passport = require('passport');

module.exports = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) { return res.status(500).json(err); }
        if (!user) { return res.status(401).json(info.message); }
        req.logIn(user, function (err) {
            if (err) { return res.status(500).json(err); }
            return res.json(user);
        });
    })(req, res, next);
};