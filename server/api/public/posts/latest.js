const mongoose = require('mongoose');

module.exports = function (req, res) {
    let query = {};
    if (req.query.featured) {
        query.featured = true;
    }

    let limit = 10;
    if(!isNaN(req.query.count)) {
        limit = parseInt(req.query.count);
    }
    mongoose.model('Post')
        .find(query)
        .sort("-publishedAt")
        .lean()
        .populate('tags')
        .populate('author')
        .select('-content')
        .limit(limit)
        .then(function (posts) {
            res.json(posts);
        })
        .catch((error) => res.status(500).json(error));
};