const mongoose = require('mongoose');

module.exports = function (req, res) {
    let query = {
        status: "published"
    };

    if (req.query.q) {
        query['$text'] = {
            '$search': req.query.q
        }
    }

    let limit = 10, offset = 0;
    if (!isNaN(req.query.limit)) {
        limit = parseInt(req.query.limit);
    }
    if (!isNaN(req.query.offset)) {
        offset = parseInt(req.query.offset);
    }

    Promise.all([
        mongoose.model('ShopItem')
            .find(query)
            .limit(limit)
            .skip(offset)
            .sort("-featured -createdAt")
            .lean(),
        mongoose.model('ShopItem')
            .countDocuments(query)
    ]).then(function ([items, count]) {
        res.header('X-Total-Count', count);
        res.json(items);
    }).catch((error) => res.status(500).json(error));
};