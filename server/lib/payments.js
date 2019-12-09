const request = require('request-promise-native'),
    mongoose = require('mongoose');

async function authorize(settings) {
    if (!settings)
        settings = await mongoose.model('Settings').findOne({ name: 'default' });
    let authCredentials = genCredentials(settings);
    let response = await request.post('/oauth2/token', {
        form: {
            'grant_type': 'client_credentials'
        },
        baseUrl: settings.ipayEndpoint,
        headers: {
            'Accept': 'application/json',
            'Authorization': `Basic ${authCredentials}`
        },
        json: true
    });
    return response;
}

async function orderRequest(order) {
    let settings = await mongoose.model('Settings').findOne({ name: 'default' });
    let authorization = authorize(settings);
    let response = await request.post('/checkout/orders', {
        body: {
            intent: 'CAPTURE',
            items: order.items.map((item) => ({
                description: item.title,
                amount: convertAmount(item.amount * item.quantity),
                quantity: item.quantity,
                product_id: item._id
            })),
            redirect_url: ``,
            shop_order_id: order.id,
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
            'Accept': 'application/json',
            'Authorization': `Bearer ${authorization.access_token}`
        },
        json: true
    });

    return response;
}

async function checkOrder(orderId) {
    let settings = await mongoose.model('Settings').findOne({ name: 'default' });
    let authorization = authorize(settings);
    let response = await request.get(`/checkout/orders/${orderId}`, {
        baseUrl: settings.ipayEndpoint,
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${authorization.access_token}`
        },
        json: true
    });
}

async function refundRequest(orderId) {
    let settings = await mongoose.model('Settings').findOne({ name: 'default' });
    let authorization = authorize(settings);
    let response = await request.post('/checkout/refund', {
        form: {
            order_id: orderId
        },
        baseUrl: settings.ipayEndpoint,
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${authorization.access_token}`
        },
        json: true
    });
}

async function processCallback() {
    let settings = await mongoose.model('Settings').findOne({ name: 'default' });
    let authorization = authorize(settings);
}

function genCredentials(settings) {
    return btoa(settings.ipaySecret + settings.ipayId);
}

function convertAmount(original) {
    return (original / 100).toFixed(2);
}

module.exports = { authorize, orderRequest, refundRequest, checkOrder, processCallback };