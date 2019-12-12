/*
order_id
status
payment_hash
ipay_payment_id
status_description
shop_order_id
transaction_id
pan
*/

const orders = require('@lib/orders');

module.exports = function (req, res) {
    orders.checkOrder(req.query.id).catch((error) => {
        console.error("Error while checking order", error);
    });
    res.redirect(301, '/order/callback?id=' + req.query.id);
}