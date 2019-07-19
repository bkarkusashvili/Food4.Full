const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('UserFavorite').create({
        user: req.user.id,
        post: req.params.postId
    }).then(function () {
        res.status(201).end();
    }).catch((error) => res.status(500).json(error));
};