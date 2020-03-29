const mongoose = require("mongoose");

module.exports = function (req, res) {
    res.status(400).json({ message: "Error!" });
    // orders.createOrder(req.body, req.user).then(function (order) {
    //     res.json(order);
    // }).catch((error) => res.status(500).json(error));
}