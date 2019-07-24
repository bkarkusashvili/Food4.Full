const Schema = require('mongoose').Schema;

const schema = new Schema({
    code: {
        type: String
    },
    sent: {
        type: Boolean
    },
    expires: {
        type: Date,
        expires: 0
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = schema;