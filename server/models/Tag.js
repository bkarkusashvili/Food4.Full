const Schema = require('mongoose').Schema;

const tagSchema = new Schema({
    slug: {
        type: String,
        required: true
    },
    title: {
        type: String
    }
}, { timestamps: true });


module.exports = tagSchema;