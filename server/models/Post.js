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
    subtitle: {
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
    status: {
        type: String
    },
    publishedAt: {
        type: Date
    },
    ingredients: [String],
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    textTags: [String],
    author: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

postSchema.index({ '$**': 'text' });

postSchema.methods.setTextTags = function () {
    if (!this.tags)
        return;
    this.textTags = this.tags.map((tag) => tag.title);
}

module.exports = postSchema;