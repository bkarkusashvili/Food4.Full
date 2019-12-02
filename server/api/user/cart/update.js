const mongoose = require('mongoose');

module.exports = function (req, res) {
    let items = req.body.items;
    mongoose.model('ShopCart').findOne({
        user: req.user.id
    }).then(function (cart) {
        if (cart)
            return cart;
        else
            return mongoose.model('ShopCart').create({ user: req.user.id });
    }).then(function (cart) {
        cart.items = items;
        return cart.save();
    }).then(function (cart) {
        res.json(cart);
    }).catch((error) => res.status(500).json(error));
};