const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('UserRecipe')
        .findById(req.params.id)
        .lean()
        .populate('submitter')
        .then(function (post) {
            if (!post) {
                return res.status(404).send("User recipe not found");
            }
            res.json(post);
        })
        .catch((error) => res.status(500).json(error));
};