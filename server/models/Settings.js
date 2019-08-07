const Schema = require('mongoose').Schema;

const schema = new Schema({
    name: {
        type: String,
        unique: true,
        default: "default"
    },
    navigation: {
        type: Array,
        default: []
    }
});

module.exports = schema;