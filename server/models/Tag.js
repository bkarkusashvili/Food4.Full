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
    featured: {
        type: Boolean,
        default: false,
        index: true
    },
    priority: {
        type: Number,
        default: 0,
        index: true
    },
    title: {
        type: String
    }
}, { timestamps: true });

schema.index({ '$**': 'text' });

module.exports = schema;