const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('Tag')
        .findOne({ slug: req.params.id })
        .lean()
        .then(function (tag) {
            if (!tag) {
                return res.status(404).send("Tag not found");
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
                mongoose.model('Post')
                    .find(query)
                    .lean()
                    .limit(limit)
                    .skip(offset)
                    .populate('author')
                    .populate('tags')
                    .sort('-featured -createdAt'),
                mongoose.model('Post')
                    .countDocuments(query)
            ]).then(function ([posts, count]) {
                res.header('X-Total-Count', count);
                tag.posts = posts;
                res.json(tag);
            })
        })
        .catch((error) => res.status(500).json(error));
}