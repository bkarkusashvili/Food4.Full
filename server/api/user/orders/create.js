const orders = require("@lib/orders");

module.exports = function (req, res) {
    orders.createOrder(req.body, req.user).then(function (order) {
        res.json(order);
    }).catch((error) => res.status(500).json(error));
}