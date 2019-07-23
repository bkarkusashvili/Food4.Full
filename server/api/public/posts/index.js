const mongoose = require('mongoose');

module.exports = function(req, res) {
    let query = {};
    if(req.query.q) {
        query['$text'] = {
            '$search': req.query.q
        }
    }
    mongoose.model('Post').find(query).select('-content').then(function (posts) {
        res.json(posts);
    }).catch((error) => res.status(500).json(error));
};