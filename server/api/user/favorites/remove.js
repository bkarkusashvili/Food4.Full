const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('UserFavorite').remove({
        user: req.user.id,
        post: req.params.postId
    }).then(function () {
        res.status(200).end();
    }).catch((error) => res.status(500).json(error));
};