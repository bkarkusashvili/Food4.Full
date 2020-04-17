const users = require('@lib/users');

module.exports = function (req, res) {
    const email = req.body.email;
    
    users.forgotPassword(email).then(function () {
        res.status(200).json({ message: "კოდი გამოგზავნილია!" });
    }).catch(function (error) {
        res.status(500).json(error);
    });
}