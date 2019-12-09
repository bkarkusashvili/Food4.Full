const mongoose = require('mongoose'),
    users = require('@lib/users');

module.exports = function (req, res) {
    let email = req.query.email || req.body.email;
    mongoose.model('User').findOne({ unconfirmedEmail: email }).sort('-createdAt').then(function(user) {
        if(!user) {
            return res.status(404).send("Invalid email");
        } else {
            return users.generateAndSendConfirmationCode(user).then(() => {
                res.status(201).end();
            });
        }
    }).catch(function (error) {
        res.status(500).json(error);
    });
}