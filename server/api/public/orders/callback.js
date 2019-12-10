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

const orders = require('@lib/paordersyments');

module.exports = function (req, res) {
    orders.checkOrder(req.query.id);
    res.redirect(301, '/orders/' + req.query.id);
}