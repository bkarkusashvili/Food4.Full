const util = require('util'),
    fs = require('fs'),
    path = require('path'),
    mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('File').findById(req.params.id).then(function (file) {
        util.promisify(fs.unlink)(file.path).catch((error) => console.error("Error deleting file", error));
        return mongoose.model('File').findByIdAndRemove(file.id);
    }).then(function () {
        res.status(200).end();
    }).catch((error) => res.status(500).json(error));
}