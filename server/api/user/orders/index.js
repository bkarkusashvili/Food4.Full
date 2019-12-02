const mongoose = require('mongoose');

module.exports = function (req, res) {
    let query = { user: req.user.id },
        limit = 10, offset = 0;
    if (!isNaN(req.query.limit)) {
        limit = parseInt(req.query.limit);
    }
    if (!isNaN(req.query.offset)) {
        offset = parseInt(req.query.offset);
    }

    Promise.all([
        mongoose.model('ShopOrder')
            .find(query)
            .limit(limit)
            .skip(offset)
            .lean(),
        mongoose.model('ShopOrder')
            .countDocuments(query)
    ]).then(function ([orders, count]) {
        res.header('X-Total-Count', count);
        res.json(orders);
    }).catch((error) => res.status(500).json(error));
};