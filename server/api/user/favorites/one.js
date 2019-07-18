const db = require('../../../db');

module.exports = function (req, res) {
    db.models.UserFavorite.find({
        user: req.user.id,
        post: req.params.postId
    }).then(function (favorite) {
        if (favorite)
            res.json(favorite);
        else
            res.status(404).end();
    }).catch((error) => res.status(500).json(error));
};