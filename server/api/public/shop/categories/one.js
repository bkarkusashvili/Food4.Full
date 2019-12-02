const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('ShopCategory')
        .findOne({ slug: req.params.id })
        .lean()
        .then(function (tag) {
            if (!tag) {
                return res.status(404).send("Category not found");
            }

            let query = { tags: mongoose.Types.ObjectId(tag._id) },
                limit = 10, offset = 0;
            if (!isNaN(req.query.limit)) {
                limit = parseInt(req.query.limit);
            }
            if (!isNaN(req.query.offset)) {
                offset = parseInt(req.query.offset);
            }

            return Promise.all([
                mongoose.model('ShopItem')
                    .find(query)
                    .lean()
                    .limit(limit)
                    .offset(offset)
                    .sort('-featured -createdAt'),
                mongoose.model('ShopItem')
                    .countDocuments(query)
            ]).then(function ([items, count]) {
                res.header('X-Total-Count', count);
                tag.shopitems = items;
                res.json(tag);
            })
        })
        .catch((error) => res.status(500).json(error));
}