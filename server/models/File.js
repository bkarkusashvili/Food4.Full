const Schema = require('mongoose').Schema;

const fileSchema = new Schema({
    path: { type: String },
    url: { type: String },
    name: { type: String },
    friendlyName: { type: String },
    size: { type: Number },
    md5: { type: String },
    mimetype: { type: String }
}, { timestamps: true });

module.exports = fileSchema;