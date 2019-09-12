const mongoose = require('mongoose');
module.exports = function () {
    const Post = mongoose.model('Post');
    return Post.find({}).lean().then(function(posts) {
        return Promise.all(posts.map((post) => {
            if(!post.ingredients || !post.ingredients.length || typeof post.ingredients[0] === 'object') return;

            let ingredients = {
                name: "",
                id: "0",
                section: true,
                children: post.ingredients.map((ingredient, index) => ({ name: ingredient, id: ["0", index].join('-') }))
            };

            return Post.findByIdAndUpdate(post._id, { ingredients });
        }));
    });
}