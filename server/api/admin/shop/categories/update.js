const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('ShopCategory').findByIdAndUpdate(req.params.id, req.body).then(function (category) {
        if (!category)
            return res.status(404).send("Category not found");
        mongoose.model('ShopItem').find({
            category: req.params.id
        }).then(function (items) {
            items.forEach(function (item) {
                item.categoryName = category.name;
                item.save();
            });
        }).catch((error) => console.error(error));
        res.status(200).end();
    }).catch((error) => res.status(500).json(error));
};