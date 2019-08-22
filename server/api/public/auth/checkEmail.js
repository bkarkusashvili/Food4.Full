const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('User').find({ email: req.query.email }).count().then(function (count) {
        if (count > 0) {
            res.json({ taken: true })
        } else {
            res.json({ taken: false })
        }
    }).catch(function (error) {
        res.status(500).json(error);
    });
}