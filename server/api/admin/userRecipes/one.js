const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('UserRecipe')
        .findById(req.params.id)
        .lean()
        .populate('submitter')
        .then(function (userRecipe) {
            if (!userRecipe) {
                return res.status(404).send("User recipe not found");
            }
            res.json(userRecipe);
        })
        .catch((error) => res.status(500).json(error));
};