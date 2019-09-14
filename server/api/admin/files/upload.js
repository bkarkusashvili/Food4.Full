const files = require('../../../lib/files');

module.exports = function (req, res) {
    if (req.files == null || req.files.file == null) {
        return res.status(400).send('No files were uploaded.');
    }

    files.upload(req.files.file, req.body.name, true).then(function (uploadedFile) {
        res.status(201).json(uploadedFile);
    }).catch((error) => res.status(500).json(error));
}