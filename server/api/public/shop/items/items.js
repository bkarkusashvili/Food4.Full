const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('ShopItem')
        .find({ _id: req.query.id })
        .sort("-featured priority -createdAt")
        .lean()
        .then(function (items) {
            itemLimit = categories.length * itemLimit;

            res.json(items);
        })
        .catch((error) => res.status(500).json(error))
}