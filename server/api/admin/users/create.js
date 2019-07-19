const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('User').create(req.body).then(function (user) {
        res.json(user);
    }).catch((error) => res.status(500).json(error));
};