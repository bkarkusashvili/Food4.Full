const Schema = require('mongoose').Schema;

const schema = new Schema({
    amount: Number,
    items: [Object],
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = schema;