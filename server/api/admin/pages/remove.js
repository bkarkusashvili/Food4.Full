const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('Page').findByIdAndRemove(req.params.id)
        .then(function () {
            res.status(200).end()
        })
        .catch((error) => {
            console.error("Error removing page", error);
            res.status(500).json(error)
        });
};