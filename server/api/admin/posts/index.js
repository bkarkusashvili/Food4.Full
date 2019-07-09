const db = require('../../../db');

module.exports = function(req, res) {
    db.models.Post.find({}).then(function (posts) {
        res.json(posts);
    }).catch((error) => res.status(500).json(error));
};