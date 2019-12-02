const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('ShopItem').create(req.body).then(function (item) {
        res.status(201).json(item);
    }).catch((error) => res.status(500).json(error));
};