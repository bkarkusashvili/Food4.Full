const Schema = require('mongoose').Schema;

const postSchema = new Schema({
    type: {
        type: String
    },
    slug: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }]
}, { timestamps: true });

module.exports = postSchema;