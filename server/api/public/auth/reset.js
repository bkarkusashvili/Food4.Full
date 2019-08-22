const users = require('../../../lib/users');

module.exports = function (req, res) {
    const code = req.body.code,
        password = req.body.password;

    if (!code)
        return res.status(400).send("No code");
    if (!password)
        return res.status(400).send("No password");

    users.resetPassword(code, password).then(function (user) {
        if (!user) {
            return res.status(404).send("Code not found");
        }

        res.status(200).send("Success");
    }).catch(function (error) {
        res.status(500).json(error);
    });
};