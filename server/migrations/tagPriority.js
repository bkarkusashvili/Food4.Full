const mongoose = require('mongoose');
module.exports = function () {
    const Tag = mongoose.model('Tag');
    return Tag.find({}).then(function(tags) {
        return Promise.all(tags.map((tag) => {
            if(tag.priority != null && tag.invisible != null) return;

            tag.priority = 0;
            tag.invisible = false;

            return tag.save();
        }));
    });
}