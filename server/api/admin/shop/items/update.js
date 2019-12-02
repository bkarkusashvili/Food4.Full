const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('ShopItem').findByIdAndUpdate(req.params.id, req.body).then(function (item) {
        if (!item)
            return res.status(404).send("Item not found");

        res.status(200).end();
    }).catch((error) => res.status(500).json(error));
};