const mongoose = require('mongoose');

module.exports = function (req, res) {
    mongoose.model('Page')
        .findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(function (page) {
            if (!page)
                return res.status(404).send("Page not found");
            res.json(page);
        })
        .catch((error) => {
            console.error("Error updating page", error);
            res.status(500).json(error)
        });
};