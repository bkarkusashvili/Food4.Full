const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('File').find({}).then(function(files){
        res.json(files);
    }).catch((error) => res.status(500).json(error));
}