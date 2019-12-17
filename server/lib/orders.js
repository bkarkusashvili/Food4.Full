const mongoose = require('mongoose'),
    consola = require('consola'),
    payments = require('./payments'),
    mailer = require('../mailer');

async function createOrder(orderParams, user) {
    let items = await syncItems(orderParams.items);
    if (!items.length)
        throw new Error("შეკვეთა ცარიელია!");
    let order = new mongoose.model('ShopOrder')({
        address: orderParams.address,
        items: items,
        user: user,
        amount: getTotal(items),
        itemCount: itemCount(items),
        status: "CREATED"
    });
    return order.save();
}

async function updateOwnOrder(orderId, orderParams, user) {
    let order = await mongoose.model('ShopOrder').findOne({
        user: user._id,
        _id: orderId
    });
    if (!order)
        return;

    let items = await syncItems(orderParams.items);
    if (!items.length)
        throw new Error("შეკვეთა ცარიელია!");
    order.address = orderParams.address;
    order.items = items;
    order.amount = getTotal(items);
    order.itemCount = itemCount(items);
    return order.save();
}

async function payOrder(orderId, user) {
    let order = await mongoose.model('ShopOrder').findOne({
        user: user._id,
        _id: orderId
    });
    if (!order)
        return;
    let paymentResult = await payments.orderRequest(order);
    if (!order.paymentLog || !(order.paymentLog instanceof Array))
        order.paymentLog = [];
    order.paymentLog.push({ date: new Date(), operation: "pay", result: paymentResult });
    order.payment = paymentResult;
    order.status = "PAYMENT_PENDING";
    await order.save();
    return order;
}

async function checkOrder(orderId, user) {
    let order = await mongoose.model('ShopOrder').findOne(user ? { _id: orderId, user: user._id } : { _id: orderId }).populate('user');
    if (!order)
        return;
    let paymentResult = await payments.checkOrder(order);

    if (!order.paymentLog || !(order.paymentLog instanceof Array))
        order.paymentLog = [];

    order.paymentLog.push({ date: new Date(), operation: "check", result: paymentResult });

    if ((order.status === "CREATED" || order.status === "PAYMENT_PENDING")
        && paymentResult.status === "PERFORMED") {
        order.status = "PAID";
        Object.assign(order.payment, paymentResult);
        await reserveItems(order.items);
        sendOrderConfirmedEmail(order, order.user);
    }

    if ((order.status === "CREATED" || order.status === "PAYMENT_PENDING")
        && paymentResult.status === "REJECTED") {
        Object.assign(order.payment, paymentResult);
        order.status = "CANCELLED";
    }

    return order.save();
}

async function cancelOwnOrder(orderId, user) {
    let order = await mongoose.model('ShopOrder').findOne({ _id: orderId, user: user._id });
    if (order.status !== "CREATED" && order.status !== "PAYMENT_PENDING")
        throw new Error("შეკვეთის გასაუქმებლად მიმართეთ ადმინისტრაციას!");
    order.status = "CANCELLED";
    return order.save();
}

async function cancelOrder(orderId) {
    let order = await mongoose.model('ShopOrder').findById(orderId).populate('user');
    if (!order)
        return;

    if (!order.paymentLog || !(order.paymentLog instanceof Array))
        order.paymentLog = [];

    if (order.status === "PAID") {
        await unreserveItems(order.items);
        let refundResult = await payments.refundRequest(order);
        order.paymentLog.push({ date: new Date(), operation: "refund", result: refundResult });
        sendOrderRefundedEmail(order, user);
    } else if (order.status === "PAYMENT_PENDING") {
        let refundResult = await payments.refundRequest(order);
        order.paymentLog.push({ date: new Date(), operation: "refund", result: refundResult });
    }

    order.status = "CANCELLED";

    return order.save();
}

async function updateOrder(orderId, orderParams) {
    let order = await mongoose.model('ShopOrder').findById(orderId).populate('user');
    if (!order)
        return;

    if(orderParams.status === "SHIPPED" && order.status !== "SHIPPED") {
        sendOrderShippedEmail(order, order.user);
    }
    if(orderParams.status === "FINISHED" && order.status !== "FINISHED") {
        sendOrderFinishedEmail(order, order.user);
    }

    Object.assign(order, orderParams);
    return order.save();
}

async function sendOrderConfirmedEmail(order, user) {
    let orderUrl = `https://food4.ge/orders/${order._id}`;

    try {
        return await mailer.sendTemplated('order-confirmation', {
            orderUrl: orderUrl,
            order: order
        }, {
            to: user.email,
            subject: "შეკვეთის დადასტურება - FOOD4.GE",
            text: `თქვენი შეკვეთა მიღებულია, შეკვეთის სანახავად ეწვიეთ ლინკს: ${orderUrl}`
        });
    } catch (error) {
        consola.error("Error sending order email", error);
    }
}
async function sendOrderShippedEmail(order, user) {
    let orderUrl = `https://food4.ge/orders/${order._id}`;
    
    try {
        return await mailer.sendTemplated('order-shipped', {
            orderUrl: orderUrl,
            order: order
        }, {
            to: user.email,
            subject: "შეკვეთის განახლება - FOOD4.GE",
            text: `თქვენი შეკვეთა გამოგზავნილია, შეკვეთის სანახავად ეწვიეთ ლინკს: ${orderUrl}`
        });
    } catch (error) {
        consola.error("Error sending order email", error);
    }
}
async function sendOrderFinishedEmail(order, user) {
    let orderUrl = `https://food4.ge/orders/${order._id}`;

    try {
        return await mailer.sendTemplated('order-finished', {
            orderUrl: orderUrl,
            order: order
        }, {
            to: user.email,
            subject: "შეკვეთის განახლება - FOOD4.GE",
            text: `თქვენი შეკვეთა დასრულებულია, შეკვეთის სანახავად ეწვიეთ ლინკს: ${orderUrl}`
        });
    } catch (error) {
        consola.error("Error sending order email", error);
    }
}
async function sendOrderRefundedEmail(order, user) {
    let orderUrl = `https://food4.ge/orders/${order._id}`;

    try {
        return await mailer.sendTemplated('order-refunded', {
            orderUrl: orderUrl,
            order: order
        }, {
            to: user.email,
            subject: "შეკვეთის გაუქმება - FOOD4.GE",
            text: `თქვენი შეკვეთა გაუქმებულია, შეკვეთის სანახავად ეწვიეთ ლინკს: ${orderUrl}`
        });
    } catch (error) {
        consola.error("Error sending order email", error);
    }
}

async function reserveItems(items) {
    const ShopItem = mongoose.model('ShopItem');
    let promises = items.map((item) => {
        return ShopItem.findByIdAndUpdate(item._id, {
            $inc: {
                stock: - item.quantity
            }
        });
    });
    return Promise.all(promises);
}

async function unreserveItems(items) {
    const ShopItem = mongoose.model('ShopItem');
    let promises = items.map((item) => {
        return ShopItem.findByIdAndUpdate(item._id, {
            $inc: {
                stock: item.quantity
            }
        });
    });
    return Promise.all(promises);
}

async function syncItems(items) {
    let dbItems = await mongoose.model('ShopItem').find({ _id: items.map((item) => item._id) });
    let newItems = items.map((item) => {
        let dbItem = findIndex(dbItems, item._id);
        if (!dbItem)
            return null;
        Object.assign(item, dbItem);
        if (item.quantity > item.stock)
            item.quantity = item.stock;
        return item;
    }).filter((item) => item != null);
    return newItems;
}

function findIndex(items, _id) {
    for (let i = 0; i < items.length; i++) {
        if (items[i]._id === _id)
            return i;
    }
    return -1;
}

function getTotal(items) {
    return items.reduce((sum, item) => {
        if (!item.quantity || !item.price)
            return sum;
        return sum + Math.ceil(item.quantity * item.price)
    }, 0);
}

function itemCount(items) {
    return items.reduce((sum, item) => {
        if (!item.quantity)
            return sum;
        return sum + item.quantity
    }, 0);
}

module.exports = { createOrder, payOrder, cancelOwnOrder, cancelOrder, updateOwnOrder, updateOrder, syncItems, checkOrder };