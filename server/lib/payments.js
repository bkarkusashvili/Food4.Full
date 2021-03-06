const request = require('request-promise-native'),
    mongoose = require('mongoose');

async function authorize(settings) {
    if (!settings)
        settings = await mongoose.model('Settings').findOne({ name: 'default' });
    let response = await request.post('/oauth2/token', {
        form: {
            'grant_type': 'client_credentials'
        },
        baseUrl: settings.ipayEndpoint,
        headers: {
            'Accept': 'application/json'
        },
        auth: {
            'user': settings.ipayId,
            'pass': settings.ipaySecret
        },
        json: true
    });
    return response;
}

async function orderRequest(order) {
    let settings = await mongoose.model('Settings').findOne({ name: 'default' });
    let authorization = await authorize(settings);
    let response = await request.post('/checkout/orders', {
        body: {
            intent: 'CAPTURE',
            items: order.items.map((item) => ({
                description: item.title,
                amount: convertAmount(item.price * item.quantity),
                quantity: item.quantity,
                product_id: item._id
            })),
            redirect_url: `https://food4.ge/api/orders/callback?id=${order._id}`,
            shop_order_id: order._id,
            purchase_units: [{
                amount: {
                    currency_code: "GEL",
                    value: convertAmount(order.amount)
                },
                industry_type: "ECOMMERCE"
            }]
        },
        baseUrl: settings.ipayEndpoint,
        headers: {
            'Accept': 'application/json'
        },
        auth: {
            bearer: authorization.access_token
        },
        json: true
    });

    return response;
}

async function checkOrder(order) {
    if(!order.payment)
        return;
    let settings = await mongoose.model('Settings').findOne({ name: 'default' });
    let authorization = await authorize(settings);
    let response = await request.get(`/checkout/orders/${order.payment.order_id}`, {
        baseUrl: settings.ipayEndpoint,
        headers: {
            'Accept': 'application/json'
        },
        auth: {
            bearer: authorization.access_token
        },
        json: true
    });
    return response;
}

async function refundRequest(order) {
    if(!order.payment)
        return;
    let settings = await mongoose.model('Settings').findOne({ name: 'default' });
    let authorization = await authorize(settings);
    let response = await request.post('/checkout/refund', {
        form: {
            order_id: order.payment.order_id
        },
        baseUrl: settings.ipayEndpoint,
        headers: {
            'Accept': 'application/json'
        },
        auth: {
            bearer: authorization.access_token
        },
        json: true
    });
    return response;
}

function convertAmount(original) {
    return (original / 100).toFixed(2);
}

module.exports = { authorize, orderRequest, refundRequest, checkOrder };