const mongoose = require('mongoose');

module.exports = function (req, res) {
    let query = {
        status: "published",
        publishedAt: {
            $lte: new Date()
        }
    };
    if (req.query.featured != null) {
        query.featured = Boolean(req.query.featured);
    }

    let limit = 10, offset = 0;
    if (!isNaN(req.query.limit)) {
        limit = parseInt(req.query.limit);
    }
    if (!isNaN(req.query.offset)) {
        offset = parseInt(req.query.offset);
    }

    Promise.all([
        mongoose.model('Post')
            .find(query)
            .sort("-publishedAt")
            .lean()
            .populate('tags')
            .populate('author')
            .select('-content')
            .limit(limit)
            .skip(offset),
        mongoose.model('Post')
            .countDocuments(query)
    ]).then(function ([posts, count]) {
        res.header('X-Total-Count', count);
        res.json(posts);
    }).catch((error) => res.status(500).json(error));
};