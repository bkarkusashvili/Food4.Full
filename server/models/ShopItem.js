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
    sold: {
        type: Number,
        index: true
    },
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
    hidden: {
        type: Boolean,
        default: false,
        index: true
    }
}, { timestamps: true });

module.exports = schema;