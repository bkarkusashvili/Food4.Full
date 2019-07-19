const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('User').find({}).then(function (users) {
        res.json(users);
    }).catch((error) => res.status(500).json(error));
};