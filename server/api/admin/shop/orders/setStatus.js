const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('ShopOrder')
        .findById(req.params.id)
        .populate('user')
        .lean()
        .then(function (order) {
            if (!order) {
                return res.status(404).send("Order not found");
            }
            res.json(order);
        })
        .catch((error) => res.status(500).json(error));
};