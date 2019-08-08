const fs = require('fs-extra'),
    path = require('path'),
    settingsPath = path.join(__dirname, "../../../../static/settings.json");

module.exports = function (req, res) {
    fs.readJSON(settingsPath).then((currentSettings) => {
        let newSettings = Object.assign({}, currentSettings, req.body);
        return fs.writeJSON(settingsPath, newSettings);
    }).then((settings) => res.json(settings)).catch(err => res.status(500).json(err));
}