const orders = require('@lib/orders');

module.exports = function (req, res) {
    orders.checkOrder(req.params.id).then(function (order) {
        if (order)
            res.json(order);
        else
            res.status(404).send("შეკვეთა ვერ მოიძებნა!");
    }).catch((error) => {
        console.error("Error while checking order", error);
        res.status(500).json(error);
    });
};