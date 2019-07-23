const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('Tag').findByIdAndUpdate(req.params.id, req.body).then(function (tag) {
        if(!tag)
            return res.status(404).send("Tag not found");
        res.status(200).end();
    }).catch((error) => res.status(500).json(error));
};