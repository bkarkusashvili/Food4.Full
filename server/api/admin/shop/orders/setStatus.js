const orders = require('@lib/orders');

module.exports = function (req, res) {
    let orderParams = {
        status: req.body.status
    };
    
    orders.updateOrder(req.params.id, orderParams)
        .then(function (order) {
            if (!order) {
                return res.status(404).send("Order not found");
            }
            res.json(order);
        })
        .catch((error) => res.status(500).json(error));
};