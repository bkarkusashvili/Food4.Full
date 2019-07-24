const Schema = require('mongoose').Schema;

const schema = new Schema({
    slug: {
        type: String,
        required: true
    },
    title: {
        type: String
    }
}, { timestamps: true });


module.exports = schema;