const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('Settings').findOne({ name: "default" }).then(function (settings) {
        res.json(settings);
    }).catch((error) => res.status(500).json(error));
}