const Schema = require('mongoose').Schema;

const schema = new Schema({
    slug: {
        type: String,
        required: true
    },
    invisible: {
        type: Boolean,
        default: false
    },
    title: {
        type: String
    }
}, { timestamps: true });


module.exports = schema;