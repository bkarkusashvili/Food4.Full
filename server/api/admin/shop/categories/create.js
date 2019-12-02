const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('ShopCategory').create(req.body).then(function (category) {
        res.status(201).json(category);
    }).catch((error) => res.status(500).json(error));
};