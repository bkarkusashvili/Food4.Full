const Schema = require('mongoose').Schema;

const schm = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    post: { type: Schema.Types.ObjectId, ref: 'Post' }
}, { timestamps: true });

module.exports = schm;