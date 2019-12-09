const users = require('@lib/users');

module.exports = function (req, res) {
    const user = req.body;

    users.register(user).then(function (user) {
        res.status(201).json(user);
    }).catch(function (error) {
        res.status(500).json(error);
    });
};