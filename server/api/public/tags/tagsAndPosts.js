const mongoose = require('mongoose');

module.exports = function (req, res) {
    let query = {};

    if (req.query._id instanceof Array) {
        let ids = [];
        for (let i in req.query._id) {
            if (mongoose.Types.ObjectId.isValid(req.query._id)) {
                ids.push(mongoose.Types.ObjectId(req.query._id));
            }
        }
        if (ids.length) {

            query['$or'] = [
                { _id: ids },
                { slug: req.query._id }
            ]
        } else {
            query['slug'] = req.query._id;
        }
    } else if (req.query._id != null) {
        if (mongoose.Types.ObjectId.isValid(req.query._id)) {
            query['$or'] = [
                { _id: id },
                { slug: mongoose.Types.ObjectId(req.query._id) }
            ]
        } else {
            query['slug'] = req.query._id;
        }
    } else {
        query.invisible = false;
    }

    if (req.query.featured)
        query.featured = true;

    let limit = 10, offset = 0, postLimit = 8, postOffset = 0;
    if (!isNaN(req.query.limit)) {
        limit = parseInt(req.query.limit);
    }
    if (!isNaN(req.query.offset)) {
        offset = parseInt(req.query.offset);
    }
    if (!isNaN(req.query.postLimit)) {
        postLimit = parseInt(req.query.postLimit);
    }
    if (!isNaN(req.query.postOffset)) {
        postOffset = parseInt(req.query.postOffset);
    }

    mongoose.model('Tag')
        .find(query)
        .limit(limit)
        .skip(offset)
        .sort("-featured priority -createdAt")
        .lean()
        .then(function (tags) {
            postLimit = tags.length * postLimit;
            return mongoose.model('Post')
                .find({ tags: { $in: tags.map((tag) => mongoose.Types.ObjectId(tag._id)) } })
                .lean()
                .limit(postLimit)
                .skip(postOffset)
                .populate('author')
                .populate('tags')
                .sort("-featured -createdAt")
                .then(function (posts) {
                    res.json({ tags, posts });
                });
        })
        .catch((error) => res.status(500).json(error))
}