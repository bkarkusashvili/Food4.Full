const mongoose = require('mongoose');

module.exports = function (req, res) {
    let query = {};

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
        mongoose.model('Tag')
            .find(query)
            .limit(limit)
            .skip(offset)
            .sort("-featured priority -createdAt")
            .lean(),
        mongoose.model('Tag')
            .countDocuments(query)
    ]).then(function ([tags, count]) {
        res.header('X-Total-Count', count);
        res.json(tags);
    }).catch((error) => res.status(500).json(error));
};