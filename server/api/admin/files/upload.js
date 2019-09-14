const files = require('../../../lib/files');

module.exports = function (req, res) {
    if (req.files == null || req.files.file == null) {
        return res.status(400).send('No files were uploaded.');
    }

    let process = req.query.process !== 'false';

    files.upload(req.files.file, req.body.name, process)
        .then(function (uploadedFile) {
            res.status(201).json(uploadedFile);
        })
        .catch((error) => {
            console.error("Error uploading file", error);
            res.status(500).json(error)
        });
}