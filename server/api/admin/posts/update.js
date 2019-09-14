const mongoose = require('mongoose');

module.exports = function (req, res) {
    if (!req.body.author) {
        req.body.author = req.user;
    }

    mongoose.model('Post')
        .findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(function (post) {
            res.json(post);
            post.setTextTags();
            return post.save().then();
        })
        .catch((error) => {
            console.error("Error saving post", error);
            res.status(500).json(error)
        });
};