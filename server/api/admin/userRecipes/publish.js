const mongoose = require('mongoose');
const slugify = require('slugify');

module.exports = function (req, res) {
    let userRecipe;

    mongoose.model('UserRecipe')
        .findById(req.params.id)
        .then(found => {
            if (!found) {
                throw { message: "რეცეპტი ვერ მოიძებნა!" };
            }
            userRecipe = found;

            let post = {
                type: "recipe",
                status: "draft",
                title: userRecipe.title,
                slug: slugify(userRecipe.title),
                content: userRecipe.content,
                excerpt: userRecipe.content
            };

            return mongoose.model('Post').create(post);
        })
        .then(post => {
            res.json(post);

            userRecipe.status = "published";
            userRecipe.publishedAt = new Date();
            userRecipe.publishedRecipe = post;
            return userRecipe.save().catch(error => {
                console.error("Error updating user recipe", error);
            });
        })
        .catch(error => {
            console.error("Error publishing", error);
            res.status(500).json(error)
        });
};