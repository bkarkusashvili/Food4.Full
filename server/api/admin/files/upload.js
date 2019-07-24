const path = require('path'),
    mongoose = require('mongoose');

module.exports = function (req, res) {
    if (req.files == null || req.files.file == null) {
        return res.status(400).send('No files were uploaded.');
    }

    let file = req.files.file,
        friendlyName = req.body.name || file.name,
        prefixedName = [Date.now(), file.name].join('_'),
        fileUrl = path.join('/uploads', prefixedName),
        filePath = path.join(__dirname, '../../../../static', fileUrl);

    file.mv(filePath).then(function () {
        return mongoose.model('File').create({
            path: filePath,
            url: fileUrl,
            name: prefixedName,
            friendlyName: friendlyName,
            size: file.size,
            md5: file.md5,
            mimetype: file.mimetype,
            type: file.mimetype.split('/')[0]
        });
    }).then(function (uploadedFile) {
        res.status(201).json(uploadedFile);
    }).catch((error) => res.status(500).json(error));
}