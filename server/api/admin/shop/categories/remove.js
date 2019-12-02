const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('ShopItem').find({
        category: req.params.id
    }).then(function (items) {
        items.forEach(function (item) {
            item.category = null;
            item.categoryName = "";
            item.save();
        });
    }).catch((error) => console.error(error));

    mongoose.model('ShopCategory').findByIdAndRemove(req.params.id).then(function () {
        res.status(200).end();
    }).catch((error) => res.status(500).json(error));
};