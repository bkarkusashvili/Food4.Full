const Schema = require('mongoose').Schema;

const schema = new Schema({
    name: {
        type: String,
        unique: true
    },
    navigation: [Object],
    frontpage: [Object],
    carousel: [Object],
    title: String,
    description: String,
    logo: String,
    noIndex: {
        type: Boolean,
        default: false
    }
});

module.exports = schema;