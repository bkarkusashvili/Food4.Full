const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('Post').find({
        tags: [req.params.id]
    }).then(function(posts){
        posts.forEach(function(post){
            if(post.tags.indexOf(req.params.id) !== -1) {
                post.setTextTags();
                post.save();
            }
        });
    }).catch((error) => console.error(error));

    mongoose.model('Tag').findByIdAndUpdate(req.params.id, req.body).then(function (tag) {
        if(!tag)
            return res.status(404).send("Tag not found");
        res.status(200).end();
    }).catch((error) => res.status(500).json(error));
};