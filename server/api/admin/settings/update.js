const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('Settings')
        .findOneAndUpdate({ name: 'default' }, req.body, { new: true })
        .then(function (post) {
            res.json(post);
        })
        .catch((error) => {
            console.error("Error saving settings", error);
            res.status(500).json(error)
        });
}