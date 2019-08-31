const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('User')
    .findById(req.params.id)
    .select('-password')
    .populate('posts')
    .then(function(user) {
        if(!user) {
            return res.status(404).send("User not found");
        }

        return res.json(user);
    })
    .catch((error) => {
        res.status(500).json(error);
    })
};