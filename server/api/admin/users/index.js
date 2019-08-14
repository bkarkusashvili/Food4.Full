const mongoose = require('mongoose');

module.exports = function (req, res) {
    let query = {};
    if (req.query.role) {
        query.role = req.query.role;
    }
    
    mongoose.model('User').find(query).then(function (users) {
        res.json(users);
    }).catch((error) => res.status(500).json(error));
};