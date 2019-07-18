const db = require('../../../db');

module.exports = function (req, res) {
    db.models.UserFavorite.find({
        user: req.user.id
    }).populate('post').then(function (favorites) {
        res.json(favorites);
    }).catch((error) => res.status(500).json(error));
};