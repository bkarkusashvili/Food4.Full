const fs = require('fs-extra'),
    path = require('path'),
    env = process.env.NODE_ENV || 'development';
// Import app config
let configs = ["default", env, "local"],
    config = {};

configs.forEach((name) => {
    let configFile = path.join(__dirname, `../config/${name}.json`);
    if (fs.pathExistsSync(configFile)) {
        console.log("Loading config file:", configFile);
        try {
            let cnf = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
            for (let key in cnf) {
                if (key in config && typeof config[key] === 'object' && typeof cnf[key] === 'object') {
                    Object.assign(config[key], cnf[key]);
                } else {
                    config[key] = cnf[key];
                }
            }
        } catch (error) {
            console.error("Error loading config file", configFile);
            console.error(error);
        }
    }
});

module.exports = config;