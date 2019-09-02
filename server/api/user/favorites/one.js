const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('UserFavorite').findOne({
        user: req.user.id,
        post: req.params.postId
    }).then(function (favorite) {
        if (favorite)
            res.json(favorite);
        else
            res.status(404).end();
    }).catch((error) => res.status(500).json(error));
};