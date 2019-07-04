const fs = require('fs'),
    path = require('path'),
    mongoose = require('mongoose'),
    models = {};

var normalizedPath = path.join(__dirname, "models");

fs.readdirSync(normalizedPath).forEach(function (file) {
    let modelName = path.basename(file, '.js');
    models[modelName] = mongoose.model(modelName, require("./models/" + file));
});

module.exports = {
    connect(url) {
        return mongoose.connect(url, { useNewUrlParser: true });
    },
    models: models
};