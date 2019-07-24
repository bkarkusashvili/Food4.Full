const Schema = require('mongoose').Schema;

const schema = new Schema({
    path: { type: String },
    url: { type: String },
    name: { type: String },
    friendlyName: { type: String },
    size: { type: Number },
    md5: { type: String },
    mimetype: { type: String },
    type: { type: String }
}, { timestamps: true });

module.exports = schema;