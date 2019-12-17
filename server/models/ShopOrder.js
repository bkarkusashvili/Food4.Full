const Schema = require('mongoose').Schema;

const schema = new Schema({
    amount: Number,
    itemCount: Number,
    items: [Object],
    status: String,
    payment: Object,
    paymentLog: [Object],
    address: Object,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = schema;