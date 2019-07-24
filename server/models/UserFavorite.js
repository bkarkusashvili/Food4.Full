const Schema = require('mongoose').Schema;

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    post: { type: Schema.Types.ObjectId, ref: 'Post' }
}, { timestamps: true });

module.exports = schema;