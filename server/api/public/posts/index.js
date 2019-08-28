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
    if (req.query.featured) {
        query.featured = true;
    }

    mongoose.model('Post')
        .find(query)
        .lean()
        .populate('tags')
        .populate('author')
        .select('-content')
        .then(function (posts) {
            res.json(posts);
        })
        .catch((error) => res.status(500).json(error));
};