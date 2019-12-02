const mongoose = require('mongoose');

module.exports = function (req, res) {
    let query = {};

    if (req.query._id instanceof Array) {
        let ids = [];
        for (let i in req.query._id) {
            if (mongoose.Types.ObjectId.isValid(req.query._id)) {
                ids.push(mongoose.Types.ObjectId(req.query._id));
            }
        }
        if (ids.length) {

            query['$or'] = [
                { _id: ids },
                { slug: req.query._id }
            ]
        } else {
            query['slug'] = req.query._id;
        }
    } else if (req.query._id != null) {
        if (mongoose.Types.ObjectId.isValid(req.query._id)) {
            query['$or'] = [
                { _id: id },
                { slug: mongoose.Types.ObjectId(req.query._id) }
            ]
        } else {
            query['slug'] = req.query._id;
        }
    } else {
        query.invisible = false;
    }

    if (req.query.featured)
        query.featured = true;

    let limit = 10, offset = 0, itemLimit = 8, itemOffset = 0;
    if (!isNaN(req.query.limit)) {
        limit = parseInt(req.query.limit);
    }
    if (!isNaN(req.query.offset)) {
        offset = parseInt(req.query.offset);
    }
    if (!isNaN(req.query.postLimit)) {
        itemLimit = parseInt(req.query.postLimit);
    }
    if (!isNaN(req.query.postOffset)) {
        itemOffset = parseInt(req.query.postOffset);
    }

    mongoose.model('ShopCategory')
        .find(query)
        .limit(limit)
        .skip(offset)
        .sort("-featured priority -createdAt")
        .lean()
        .then(function (categories) {
            itemLimit = categories.length * itemLimit;
            return mongoose.model('ShopItem')
                .find({ category: { $in: categories.map((category) => mongoose.Types.ObjectId(category._id)) } })
                .lean()
                .limit(itemLimit)
                .skip(itemOffset)
                .sort("-featured -createdAt")
                .then(function (items) {
                    res.json({ categories: categories, items: items });
                });
        })
        .catch((error) => res.status(500).json(error))
}