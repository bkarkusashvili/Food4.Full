const mongoose = require('mongoose');

module.exports = function(req, res) {
    mongoose.model('Post').find({}).select('-content').then(function (posts) {
        res.json(posts);
    }).catch((error) => res.status(500).json(error));
};