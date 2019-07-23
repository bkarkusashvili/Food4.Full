const mongoose = require('mongoose');

module.exports = function(req, res) {
    mongoose.model('Post').findOne({ slug: req.params.id }).populate('tags').then(function (post) {
        if(!post) {
            return res.status(404).send("Post not found");
        }
        res.json(post);
    }).catch((error) => res.status(500).json(error));
};