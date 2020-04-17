const users = require('@lib/users');

module.exports = function (req, res) {
    const code = req.body.code,
        password = req.body.password;

    if (!code)
        return res.status(400).json({ message: "კოდი ცარიელია!" });
    if (!password)
        return res.status(400).json({ message: "პაროლი ცარიელია!" });

    users.resetPassword(code, password).then(function (user) {
        if (!user) {
            return res.status(404).json({ message: "კოდი არასწორია!" });
        }

        res.status(200).json({ message: "პაროლი წარმატებით შეიცვალა!" });
    }).catch(function (error) {
        res.status(500).json(error);
    });
};