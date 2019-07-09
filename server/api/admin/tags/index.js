const db = require('../../../db');

module.exports = function (req, res) {
    db.models.Tag.find({}).then(function (tags) {
        res.json(tags);
    }).catch((error) => res.status(500).json(error));
};