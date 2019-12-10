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

const payments = require('@lib/payments');

module.exports = function (req, res) {
    console.log("CALLBACK", req.body);
    payments.processCallback(req.body);
    res.redirect(301, '/order/callback');
}