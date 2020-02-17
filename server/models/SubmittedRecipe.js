const Schema = require('mongoose').Schema;

const schema = new Schema({
    title: {
        type: String
    },
    content: {
        type: String
    },
    excerpt: {
        type: String
    },
    status: {
        type: String
    },
    submitterName: {
        type: String
    },
    submitterEmail: {
        type: String
    },
    submitter: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = schema;