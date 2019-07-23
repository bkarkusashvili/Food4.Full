const Schema = require('mongoose').Schema;

const tagSchema = new Schema({
    slug: {
        type: String,
        required: true
    },
    title: {
        type: String
    }
}, { timestamps: true });

tagSchema.virtual('numPosts', {
    ref: 'Post', // The model to use
    localField: '_id', // Find people where `localField`
    foreignField: 'tags', // is equal to `foreignField`
    count: true // And only get the number of docs
});


module.exports = tagSchema;