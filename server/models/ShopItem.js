const Schema = require('mongoose').Schema;

const schema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'ShopCategory' },
    slug: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    price: Number,
    description: {
        type: String
    },
    pictures: [String],
    thumb: {
        type: String
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
    inStock: {
        type: Boolean,
        default: true,
        index: true
    },
    hidden: {
        type: Boolean,
        default: false,
        index: true
    }
}, { timestamps: true });

module.exports = schema;