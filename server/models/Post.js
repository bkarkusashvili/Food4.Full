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
    content: {
        type: String
    },
    excerpt: {
        type: String
    },
    picture: {
        type: String
    },
    ingredients: [String],
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }]
}, { timestamps: true });

module.exports = postSchema;