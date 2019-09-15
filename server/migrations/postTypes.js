const mongoose = require('mongoose');
module.exports = function () {
    const Post = mongoose.model('Post'),
        Tag = mongoose.model('Tag');
    return Promise.all([
        Post.updateMany({}, { type: 'recipe' }),
        Tag.updateMany({}, { type: 'recipe' })
    ]);
}