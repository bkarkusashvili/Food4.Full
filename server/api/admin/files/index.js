const mongoose = require('mongoose');

module.exports = function (req, res) {
    let query = {};
    mongoose.model('File')
        .find(query)
        .lean()
        .then(function (files) {
            res.json(files);
        })
        .catch((error) => res.status(500).json(error));
}