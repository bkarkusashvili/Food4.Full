const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('User')
        .findById(req.params.id)
        .then(function (user) {
            if (!user) {
                return res.status(404).send("User not found");
            }

            if (!req.body.password)
                delete req.body.password;

            Object.assign(user, req.body);
            let promise;
            if (req.body.password) {
                promise = user.setPassword(req.body.password).then(function () { return user.save() });
            } else {
                promise = user.save();
            }

            return promise.then(function (user) {
                res.json(user);
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json(error)
        });
};