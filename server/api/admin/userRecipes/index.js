const mongoose = require('mongoose');

module.exports = function (req, res) {
    let order = req.query.order || "-createdAt",
        query = {};

    if (req.query.q) {
        query['$text'] = {
            '$search': req.query.q
        }
    }

    if (req.query.status) {
        query.status = req.query.status;
    }

    let limit = 10, offset = 0;
    if (!isNaN(req.query.limit)) {
        limit = parseInt(req.query.limit);
    }
    if (!isNaN(req.query.offset)) {
        offset = parseInt(req.query.offset);
    }

    Promise.all([
        mongoose.model('UserRecipe')
            .find(query)
            .limit(limit)
            .skip(offset)
            .lean()
            .sort(order)
            .populate('submitter')
            .select('-content'),
        mongoose.model('UserRecipe')
            .countDocuments(query)
    ]).then(function ([userRecipes, count]) {
        res.header('X-Total-Count', count);
        res.json(userRecipes);
    }).catch((error) => res.status(500).json(error));
};