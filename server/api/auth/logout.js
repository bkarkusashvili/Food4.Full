module.exports = function (req, res) {
    req.logout();
    res.status(200).end();
};