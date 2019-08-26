const mongoose = require('mongoose');

module.exports = function (req, res) {
    let query = {};
    if (req.query._id)
        query._id = req.query._id;

    mongoose.model('Tag')
        .find(query)
        .lean()
        .then(function (tags) {
            res.json(tags);
        })
        .catch((error) => res.status(500).json(error))
}