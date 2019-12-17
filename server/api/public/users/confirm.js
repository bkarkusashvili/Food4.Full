const consola = require('consola'),
    users = require('@lib/users');

module.exports = function (req, res) {
    const type = req.query.type || "email",
        code = req.query.code || req.body.code;

    if (!code)
        return res.status(400).send("No code");

    users.confirmEmail(code).then(function (user) {
        if (!user) {
            return res.status(404).send("Code not found");
        }

        req.logIn(user, function (err) {
            if (err) {
                consola.error("Error signing in user", err);
            } else {
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
                res.cookie('connect.sid', req.sessionID, req.session.cookie);
            }

            res.status(200).send("Success");
        });
    }).catch(function (error) {
        res.status(500).json(error);
    });
};