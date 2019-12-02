const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('ShopOrder').findOne({
        user: req.user.id,
        id: req.params.id
    }).then(function (order) {
        if (order)
            res.json(order);
        else
            res.status(404).send("Order not found!");
    }).catch((error) => res.status(500).json(error));
};