const path = require('path'),
    fs = require('fs-extra'),
    sharp = require('sharp'),
    mongoose = require('mongoose');

function upload(file, name, generateVariants, crop) {
    let friendlyName = name || file.name,
        prefixedName = [Date.now(), file.name].join('_'),
        fileUrl = path.join('/uploads', prefixedName),
        filePath = path.join(__dirname, '../../static', fileUrl);

    let options = {
        name: prefixedName,
        friendlyName: friendlyName,
        size: file.size,
        md5: file.md5,
        url: fileUrl,
        path: filePath,
        extension: path.extname(file.name),
        type: file.mimetype.split('/')[0],
        generateVariants,
        crop
    };

    return processUploadedFile(file, options).then(function (options) {
        return mongoose.model('File').create(options);
    });
}

function remove() {

}

function update() {

}

function processUploadedFile(file, options) {
    if (!options.generateVariants || options.type !== 'image')
        return fs.writeFile(options.path, file.data).then(() => options);

    let variants = {
        original: {
            url: path.join(options.url, `original${options.extension}`),
            path: path.join(options.path, `original${options.extension}`)
        },
        thumb: {
            url: path.join(options.url, `thumb${options.extension}`),
            path: path.join(options.path, `thumb${options.extension}`)
        }
    };
    
    return fs.mkdirp(options.path).then(() => {
        let promises = [];
        promises.push(sharp(file.data).toFile(variants.original.path));
        promises.push(sharp(file.data).resize(300).toFile(variants.thumb.path));
        return Promise.all(promises);
    }).then(function () {
        options.variants = variants;
        options.path = variants.original.path;
        options.url = variants.original.url;
        return options;
    }).catch((error) => {
        console.error("Error processing image", error);
        throw error;
    });
}

module.exports = { upload, remove, update }