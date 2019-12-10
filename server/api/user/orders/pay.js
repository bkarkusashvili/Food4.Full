const orders = require("@lib/orders");

module.exports = function (req, res) {
    orders.payOrder(req.params.id, req.user).then(function (order) {
        if (order)
            res.json(order);
        else
            res.status(404).send("შეკვეთა ვერ მოიძებნა!");
    }).catch((error) => {
        console.error(error);
        res.status(500).json(error)
    });
}