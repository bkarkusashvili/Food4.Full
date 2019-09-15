const Schema = require('mongoose').Schema;

const schema = new Schema({
    type: {
        type: String,
        default: 'recipe'
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
    description: {
        type: String
    },
    picture: {
        type: String
    },
    thumb: {
        type: String
    },
    originalPicture: {
        type: Schema.Types.ObjectId,
        ref: 'File'
    },
    video: {
        type: String
    },
    status: {
        type: String
    },
    publishedAt: {
        type: Date,
        index: true
    },
    featured: {
        type: Boolean,
        default: false,
        index: true
    },
    ingredients: [Object],
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    textTags: [String],
    author: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

schema.index({ '$**': 'text' });

schema.methods.setTextTags = function () {
    if (!this.tags)
        return;
    this.textTags = this.tags.map((tag) => tag.title);
}

module.exports = schema;