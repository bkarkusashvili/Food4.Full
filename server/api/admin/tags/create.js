const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('Tag').create(req.body).then(function (tag) {
        res.json(tag);
    }).catch((error) => res.status(500).json(error));
};