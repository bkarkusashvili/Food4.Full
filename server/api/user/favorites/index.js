const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('UserFavorite').find({
        user: req.user.id
    }).populate('post').then(function (favorites) {
        res.json(favorites);
    }).catch((error) => res.status(500).json(error));
};