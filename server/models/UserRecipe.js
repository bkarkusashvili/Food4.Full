const Schema = require('mongoose').Schema;

const schema = new Schema({
    title: {
        type: String
    },
    content: {
        type: String
    },
    status: {
        type: String
    },
    publishedAt: {
        type: Date
    },
    submitterName: {
        type: String
    },
    submitterEmail: {
        type: String
    },
    publishedRecipe: { type: Schema.Types.ObjectId, ref: 'Post' },
    submitter: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = schema;