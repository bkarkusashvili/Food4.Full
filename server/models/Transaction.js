const Schema = require('mongoose').Schema;

const schema = new Schema({
    amount: Number,
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = schema;