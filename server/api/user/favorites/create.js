const db = require('../../../db');

module.exports = function (req, res) {
    db.models.UserFavorite.create({
        user: req.user.id,
        post: req.params.postId
    }).then(function () {
        res.status(201).end();
    }).catch((error) => res.status(500).json(error));
};