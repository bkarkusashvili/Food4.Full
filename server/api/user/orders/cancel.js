const orders = require("@lib/orders");

module.exports = function(req, res) {
   orders.cancelOwnOrder(req.params.id, req.user).then(function (order) {
    if (order)
        res.json(order);
    else
        res.status(404).send("შეკვეთა ვერ მოიძებნა!");
}).catch((error) => res.status(500).json(error));
}