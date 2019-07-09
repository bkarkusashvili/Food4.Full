const db = require('../../../db');

module.exports = function (req, res) {
    db.models.User.find({}).then(function (users) {
        res.json(users);
    }).catch((error) => res.status(500).json(error));
};