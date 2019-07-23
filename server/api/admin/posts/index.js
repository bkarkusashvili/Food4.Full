const mongoose = require('mongoose');

module.exports = function(req, res) {
    let order = req.query.order || "-createdAt",
        query = {};

    if(req.query.status) {
        query.status = req.query.status;
    }
    
    mongoose.model('Post').find(query).sort(order).populate('tags').select('-content').then(function (posts) {
        res.json(posts);
    }).catch((error) => res.status(500).json(error));
};