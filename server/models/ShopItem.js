const Schema = require('mongoose').Schema;

const schema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'ShopCategory' },
    categoryName: String,
    slug: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    price: {
        type: Number,
        index: true
    },
    stock: {
        type: Number,
        index: true
    },
    limit: {
        type: Number, 
    },
    sold: {
        type: Number,
        index: true,
        default: 0
    },
    description: {
        type: String
    },
    excerpt: {
        type: String
    },
    pictures: [Object],
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
    linkedItems: [{ type: Schema.Types.ObjectId, ref: 'ShopItem' }],
}, { timestamps: true });

schema.index({ '$**': 'text' });

module.exports = schema;