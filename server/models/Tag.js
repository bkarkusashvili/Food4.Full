const Schema = require('mongoose').Schema;

const schema = new Schema({
    type: {
        type: String,
        default: 'recipe'
    },
    slug: {
        type: String,
        required: true,
        unique: true
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
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

schema.index({ '$**': 'text' });

module.exports = schema;