const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('User')
        .findById(req.params.id)
        .lean()
        .then(function (user) {
            if (!user) {
                return res.status(404).send("User not found");
            }
            res.json(user);
        })
        .catch((error) => res.status(500).json(error));
};