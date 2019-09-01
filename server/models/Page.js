const Schema = require('mongoose').Schema;

const schema = new Schema({
    type: {
        type: String
    },
    slug: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    subtitle: {
        type: String
    },
    content: {
        type: String
    },
    picture: {
        type: String
    }
}, { timestamps: true });

schema.index({ '$**': 'text' });

module.exports = schema;