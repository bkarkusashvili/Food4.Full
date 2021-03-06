const mongoose = require('mongoose');

module.exports = function (req, res) {
    if (!req.body.author) {
        req.body.author = req.user;
    }

    mongoose.model('Post')
        .create(req.body)
        .then(function (post) {
            res.json(post);
            post.setTextTags();
            return post.save().then();
        })
        .catch((error) => {
            console.log(JSON.stringify(req.body));
            console.error("Error saving post", error);
            res.status(500).json(error)
        });
};