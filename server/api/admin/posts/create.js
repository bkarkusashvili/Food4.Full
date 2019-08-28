const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('Post')
        .create(req.body)
        .then(function (post) {
            res.json(post);
            post.setTextTags();
            return post.save().then();
        })
        .catch((error) => res.status(500).json(error));
};