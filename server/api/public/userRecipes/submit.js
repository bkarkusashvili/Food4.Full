const mongoose = require("mongoose");

module.exports = function (req, res) {
    let userRecipe = req.body;
    if (!userRecipe)
        return res.status(400).end();

    userRecipe.submitter = req.user;
    userRecipe.status = "draft";
    userRecipe.publishedAt = null;
    userRecipe.publishedPost = null;

    if (!userRecipe.title)
        return res.status(400).json({ message: "გთხოვთ შეავსოთ სათაური!" });
    if (!userRecipe.content)
        return res.status(400).json({ message: "გთხოვთ შეავსოთ რეცეპტი!" });
    if (!userRecipe.submitterName)
        return res.status(400).json({ message: "გთხოვთ მიუთითოთ სახელი და გვარი!" });
    if (!userRecipe.submitterEmail)
        return res.status(400).json({ message: "გთხოვთ მიუთითოთ საკონტაქტო ელ-ფოსტა!" });

    mongoose.model('UserRecipe').create(userRecipe).then(function () {
        res.status(201).end();
    }).catch((error) => res.status(500).json(error));
}