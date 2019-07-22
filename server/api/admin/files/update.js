const path = require('path'),
    mongoose = require('mongoose');

module.exports = function (req, res) {
    if (req.files == null || req.files.file == null) {
        return mongoose.model('File').findByIdAndUpdate(req.params.id, { friendlyName: req.body.name }).then(function (file) {
            res.json(file);
        }).catch((error) => res.status(500).json(error))
    }

    let file = req.files.file,
        friendlyName = req.body.name || file.name,
        prefixedName = [Date.now(), file.name].join('_'),
        fileUrl = path.join('/uploads', prefixedName),
        filePath = path.join(__dirname, '../../../../static', fileUrl);

    file.mv(filePath).then(function () {
        return mongoose.model('File').findByIdAndUpdate(req.params.id, {
            path: filePath,
            url: fileUrl,
            name: prefixedName,
            friendlyName: friendlyName,
            size: file.size,
            md5: file.md5,
            mimetype: file.mimetype
        });
    }).then(function (uploadedFile) {
        res.json(uploadedFile);
    }).catch((error) => res.status(500).json(error));
}