const mongoose = require('mongoose');

module.exports = function(req, res) {
    mongoose.model('Post').findById(req.params.id).then(function (post) {
        res.json(post);
    }).catch((error) => res.status(500).json(error));
};