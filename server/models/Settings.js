const Schema = require('mongoose').Schema;

const schema = new Schema({
    name: {
        type: String,
        unique: true
    },
    navigation: [Object],
    frontpage: [Object],
    carousel: [Object],
    ads: {
        type: Object,
        default: {}
    },
    title: String,
    description: String,
    logo: String,
    noIndex: {
        type: Boolean,
        default: false
    },
    ipaySecret: String,
    ipayId: String,
    ipayEndpoint: String
});

module.exports = schema;