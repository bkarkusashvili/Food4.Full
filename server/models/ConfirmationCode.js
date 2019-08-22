const Schema = require('mongoose').Schema;

const schema = new Schema({
    type: {
        type: String,
        enum: ["phone", "email"]
    },
    code: {
        type: String
    },
    expires: {
        type: Date,
        expires: 0
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = schema;