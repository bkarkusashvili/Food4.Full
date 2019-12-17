const orders = require('@lib/orders');

module.exports = function (req, res) {
    orders.cancelOrder(req.params.id)
        .then(function (order) {
            if (!order) {
                return res.status(404).send("Order not found");
            }
            
            res.json(order);
        })
        .catch((error) => res.status(500).json(error));
};