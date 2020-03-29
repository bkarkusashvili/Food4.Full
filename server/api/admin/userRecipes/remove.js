const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('UserRecipe').findByIdAndRemove(req.params.id)
        .then(function () {
            res.status(200).end()
        })
        .catch((error) => {
            console.error("Error removing user recipe", error);
            res.status(500).json(error)
        });
};