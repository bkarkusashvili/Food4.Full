const mongoose = require('mongoose');

module.exports = function (req, res) {
    let user = new mongoose.model('User')(req.body);
    
    new Promise(function(resolve) {
        if(req.body.password) {
            resolve(user.setPassword(req.body.password));
        } else {
            resolve(user);
        }
    }).then(function () {
        return user.save();
    }).then(function (user) {
        res.status(201).json(user);
    }).catch((error) => res.status(500).json(error));
};