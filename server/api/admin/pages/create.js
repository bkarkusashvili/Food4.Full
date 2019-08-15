const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('Page')
        .create(req.body)
        .then(function (page) {
            res.json(page);
        })
        .catch((error) => res.status(500).json(error));
};