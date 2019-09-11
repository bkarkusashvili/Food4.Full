const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('Page')
        .findById(req.params.id)
        .lean()
        .then(function (page) {
            if (!page) {
                return res.status(404).send("Page not found");
            }
            res.json(page);
        })
        .catch((error) => res.status(500).json(error));
};