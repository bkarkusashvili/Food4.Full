const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('Tag').find({}).then(function (tags) {
        res.json(tags);
    }).catch((error) => res.status(500).json(error));
};