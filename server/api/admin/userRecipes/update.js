const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('UserRecipe')
        .findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(function (post) {
            res.json(post);
        })
        .catch((error) => {
            console.log(JSON.stringify(req.body));
            console.error("Error updating user recipe", error);
            res.status(500).json(error)
        });
};