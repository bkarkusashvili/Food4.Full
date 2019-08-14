const mongoose = require('mongoose');

module.exports = function (req, res) {
    let query = {};

    mongoose.model('Page')
        .find(query)
        .lean()
        .then(function (pages) {
            res.json(pages);
        })
        .catch((error) => res.status(500).json(error));
};