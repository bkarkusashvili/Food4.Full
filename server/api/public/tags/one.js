const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('Tag')
        .findOne({ slug: req.params.id })
        .lean()
        .then(function (tag) {
            if (!tag) {
                return res.status(404).send("Tag not found");
            }

            return mongoose.model('Post')
                .find({ tags: mongoose.Types.ObjectId(tag._id) })
                .lean()
                .populate('author')
                .populate('tags')
                .then(function (posts) {
                    tag.posts = posts;
                    res.json(tag);
                });
        })
        .catch((error) => res.status(500).json(error));
}