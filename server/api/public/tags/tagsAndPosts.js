const mongoose = require('mongoose');

module.exports = function (req, res) {
    let query = {};
    if (req.query._id)
        query._id = req.query._id;

    mongoose.model('Tag')
        .find(query)
        .lean()
        .then(function (tags) {
            return mongoose.model('Post')
                .find({ tags: { $in: tags.map((tag) => mongoose.Types.ObjectId(tag._id)) } })
                .lean()
                .populate('author')
                .populate('tags')
                .then(function (posts) {
                    res.json({ tags, posts });
                });
        })
        .catch((error) => res.status(500).json(error))
}