const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('Settings').findOneAndUpdate({ name: "default" }, req.body).then(function (settings) {
        if (!settings)
            return res.status(404).send("Settings not found.");
        res.status(200).end();
    }).catch((error) => res.status(500).json(error));
}