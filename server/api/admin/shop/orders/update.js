const orders = require("@lib/orders");

module.exports = function (req, res) {
    let params = { address: req.body.address, status: req.body.status };
    orders.updateOrder(req.params.id, params).then(function (order) {
        if (order)
            res.json(order);
        else
            res.status(404).send("შეკვეთა ვერ მოიძებნა!");
    }).catch((error) => res.status(500).json(error));
}