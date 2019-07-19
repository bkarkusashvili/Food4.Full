const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('Tag').findByIdAndRemove(req.params.id).then(function () {
        res.status(200).end();
    }).catch((error) => res.status(500).json(error));
};