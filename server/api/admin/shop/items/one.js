const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('ShopItem')
        .findById(req.params.id)
        .lean()
        .then(function (item) {
            if (!item) {
                return res.status(404).send("Item not found");
            }
            res.json(item);
        })
        .catch((error) => res.status(500).json(error));
};