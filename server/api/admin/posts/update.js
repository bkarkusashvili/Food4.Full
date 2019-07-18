const db = require('../../../db');

module.exports = function(req, res) {
    db.models.Post.findByIdAndUpdate(req.params.id, req.body).then(function (post) {
        res.json(post);
    }).catch((error) => res.status(500).json(error));
};