const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('File').findById(req.params.id).then(function (file) {
        if (req.body.name)
            file.friendlyName = req.body.name;
        
        if (req.files && req.files.file) {
            let newFile = req.files.file;
            return newFile.mv(file.path).then(function () {
                file.size = newFile.size;
                file.md5 = newFile.md5;
                file.mimetype = newFile.mimetype;
                file.type = newFile.mimetype.split('/')[0];
                return file.save();
            });
        }
        return file.save();
    }).then(function(file){
        res.json(file);
    }).catch((error) => res.status(500).json(error))
}