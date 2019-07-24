const fs = require('fs-extra'),
    mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('File').findById(req.params.id).then(function (file) {
        fs.unlink(file.path).catch((error) => console.error("Error deleting file", error));
        return file.remove();
    }).then(function () {
        res.status(200).end();
    }).catch((error) => res.status(500).json(error));
}