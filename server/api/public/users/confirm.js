const users = require('@lib/users');

module.exports = function (req, res) {
    const type = req.query.type || "email",
        code = req.query.code || req.body.code;

    if (!code)
        return res.status(400).send("No code");

    users.confirmEmail(code).then(function (user) {
        if(!user) {
            return res.status(404).send("Code not found");
        }

        res.status(200).send("Success");
    }).catch(function (error) {
        res.status(500).json(error);
    });
};