const mongoose = require('mongoose');

module.exports = function (req, res) {
    if(req.params.id === req.user.id) {
        return res.status(400).send("Cannot delete current user");
    }

    mongoose.model('User').findByIdAndRemove(req.params.id).then(function () {
        res.status(200).end();
    }).catch((error) => res.status(500).json(error));
};