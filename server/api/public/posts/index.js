const mongoose = require('mongoose');

module.exports = function (req, res) {
    let query = {
        status: "published",
        publishedAt: {
            $lte: new Date()
        }
    };

    if (req.query.q) {
        query['$text'] = {
            '$search': req.query.q
        };
    }
    
    if (req.query.type) {
        query.type = req.query.type;
    } else {
        query.type = 'recipe';
    }

    if (req.query.featured != null) {
        query.featured = req.query.featured !== "false";
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
            .lean()
            .limit(limit)
            .skip(offset)
            .populate('tags')
            .populate('author')
            .select('-content'),
        mongoose.model('Post')
            .countDocuments(query)
    ]).then(function ([posts, count]) {
        res.header('X-Total-Count', count);
        res.json(posts);
    }).catch((error) => res.status(500).json(error));
};