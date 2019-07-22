const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('File').findById(req.params.id).then(function(file){
        res.json(file);
    }).catch((error) => res.status(500).json(error));
}