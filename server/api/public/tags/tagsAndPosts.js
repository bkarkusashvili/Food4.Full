const mongoose = require('mongoose');

module.exports = function (req, res) {
    let query = {
        invisible: false
    };
    if (req.query._id) {
        query._id = req.query._id;
    }

    let limit = 10, offset = 0, postLimit = 10, postOffset = 0;
    if (!isNaN(req.query.limit)) {
        limit = parseInt(req.query.limit);
    }
    if (!isNaN(req.query.offset)) {
        offset = parseInt(req.query.offset);
    }
    if (!isNaN(req.query.postLimit)) {
        postLimit = parseInt(req.query.postLimit);
    }
    if (!isNaN(req.query.postOffset)) {
        postOffset = parseInt(req.query.postOffset);
    }

    mongoose.model('Tag')
        .find(query)
        .limit(limit)
        .skip(offset)
        .lean()
        .then(function (tags) {
            return mongoose.model('Post')
                .find({ tags: { $in: tags.map((tag) => mongoose.Types.ObjectId(tag._id)) } })
                .lean()
                .limit(postLimit)
                .skip(postOffset)
                .populate('author')
                .populate('tags')
                .then(function (posts) {
                    res.json({ tags, posts });
                });
        })
        .catch((error) => res.status(500).json(error))
}