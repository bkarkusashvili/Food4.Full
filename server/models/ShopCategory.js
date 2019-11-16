const Schema = require('mongoose').Schema;

const schema = new Schema({
    slug: {
        type: String,
        required: true,
        unique: true
    },
    priority: {
        type: Number,
        default: 0,
        index: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

schema.index({ '$**': 'text' });

module.exports = schema;