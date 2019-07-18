const db = require('../../../db');

module.exports = function(req, res) {
    db.models.Post.findByIdAndRemove(req.params.id).then(function () {
        res.status(200).end()
    }).catch((error) => res.status(500).json(error));
};