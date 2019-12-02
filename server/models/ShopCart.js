const Schema = require('mongoose').Schema;

const schema = new Schema({
    items: [Object],
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: false });

module.exports = schema;