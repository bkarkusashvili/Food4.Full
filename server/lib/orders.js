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
    order.paymentLog.unshift({ date: new Date(), operation: "pay", result: paymentResult });
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
    order.paymentLog.unshift({ date: new Date(), operation: "check", result: paymentResult });

    if ((order.status === "CREATED" || order.status === "PAYMENT_PENDING")
        && paymentResult.status === "PERFORMED") {
        order.status = "PAID";
        sendOrderNotification(order);
        sendOrderConfirmedEmail(order, order.user);
        await reserveItems(order.items);
    }

    if ((order.status === "CREATED" || order.status === "PAYMENT_PENDING")
        && (paymentResult.status === "REJECTED" || paymentResult.status === "VIEWED")) {
        order.status = "CANCELLED";
    }

    if (paymentResult.status === "REJECTED") {
        order.status = "CANCELLED";
    }

    return order.save();
}

async function cancelOwnOrder(orderId, user) {
    let order = await mongoose.model('ShopOrder').findOne({ _id: orderId, user: user._id });
    if (order.status !== "CREATED" && order.status !== "PAYMENT_PENDING")
        throw new Error("შეკვეთის გასაუქმებლად მიმართეთ ადმინისტრაციას!");

    if (!order.paymentLog || !(order.paymentLog instanceof Array))
        order.paymentLog = [];
    order.paymentLog.unshift({ date: new Date(), operation: "cancel_own" });
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
        // let refundResult = await payments.refundRequest(order);
        // order.paymentLog.unshift({ date: new Date(), operation: "refund", result: refundResult });
        order.paymentLog.unshift({ date: new Date(), operation: "cancel" });
        sendOrderRefundedEmail(order, user);
    } else if (order.status === "PAYMENT_PENDING") {
        let refundResult = await payments.refundRequest(order);
        order.paymentLog.unshift({ date: new Date(), operation: "refund", result: refundResult });
    }

    order.status = "CANCELLED";

    return order.save();
}

async function updateOrder(orderId, orderParams) {
    let order = await mongoose.model('ShopOrder').findById(orderId).populate('user');
    if (!order)
        return;

    let originalStatus = order.status;

    if (!order.paymentLog || !(order.paymentLog instanceof Array))
        order.paymentLog = [];
    order.paymentLog.unshift({
        date: new Date(), operation: "manual_change", result: {
            originalStatus,
            params: orderParams
        }
    });

    Object.assign(order, orderParams);

    if (orderParams.status === "PAID" && originalStatus !== "PAID") {
        sendOrderConfirmedEmail(order, order.user);
    }
    if (orderParams.status === "SHIPPED" && originalStatus !== "SHIPPED") {
        sendOrderShippedEmail(order, order.user);
    }
    if (orderParams.status === "FINISHED" && originalStatus !== "FINISHED") {
        sendOrderFinishedEmail(order, order.user);
    }

    return order.save();
}

async function sendOrderNotification(order) {
    let settings = await mongoose.model('Settings').findOne({ name: 'default' });

    if (!settings.orderNotifyEmails || !settings.orderNotifyEmails.length)
        return;

    try {
        let orderUrl = `https://food4.ge/admin/shop/orders/${order._id}`;
        let result = await mailer.sendTemplated('order-notification', {
            orderUrl: orderUrl,
            order: order
        }, {
            to: settings.orderNotifyEmails,
            subject: "შეკვეთა მიღებულია - FOOD4.GE",
            text: `მიღებულია ახალი შეკვეთა, შეკვეთის სანახავად ეწვიეთ ლინკს: ${orderUrl}`
        });
        consola.info("Sent order notification email", result);
        return result;
    } catch (error) {
        consola.error("Error sending order notification email", error);
    }
}

async function sendOrderConfirmedEmail(order, user) {
    try {
        let orderUrl = `https://food4.ge/orders/${order._id}`;
        let result = await mailer.sendTemplated('order-confirmation', {
            orderUrl: orderUrl,
            order: order
        }, {
            to: user.email,
            subject: "შეკვეთის დადასტურება - FOOD4.GE",
            text: `თქვენი შეკვეთა მიღებულია, შეკვეთის სანახავად ეწვიეთ ლინკს: ${orderUrl}`
        });
        consola.info("Sent order confirmed email", result);
        return result;
    } catch (error) {
        consola.error("Error sending order email", error);
    }
}
async function sendOrderShippedEmail(order, user) {
    try {
        let orderUrl = `https://food4.ge/orders/${order._id}`;
        let result = await mailer.sendTemplated('order-shipped', {
            orderUrl: orderUrl,
            order: order
        }, {
            to: user.email,
            subject: "შეკვეთის განახლება - FOOD4.GE",
            text: `თქვენი შეკვეთა გამოგზავნილია, შეკვეთის სანახავად ეწვიეთ ლინკს: ${orderUrl}`
        });
        consola.info("Sent order shipped email", result);
        return result;
    } catch (error) {
        consola.error("Error sending order email", error);
    }
}
async function sendOrderFinishedEmail(order, user) {
    try {
        let orderUrl = `https://food4.ge/orders/${order._id}`;
        let result = await mailer.sendTemplated('order-finished', {
            orderUrl: orderUrl,
            order: order
        }, {
            to: user.email,
            subject: "შეკვეთის განახლება - FOOD4.GE",
            text: `თქვენი შეკვეთა დასრულებულია, შეკვეთის სანახავად ეწვიეთ ლინკს: ${orderUrl}`
        });
        consola.info("Sent order shipped email", result);
        return result;
    } catch (error) {
        consola.error("Error sending order email", error);
    }
}
async function sendOrderRefundedEmail(order, user) {
    try {
        let orderUrl = `https://food4.ge/orders/${order._id}`;
        let result = await mailer.sendTemplated('order-refunded', {
            orderUrl: orderUrl,
            order: order
        }, {
            to: user.email,
            subject: "შეკვეთის გაუქმება - FOOD4.GE",
            text: `თქვენი შეკვეთა გაუქმებულია, შეკვეთის სანახავად ეწვიეთ ლინკს: ${orderUrl}`
        });
        consola.info("Sent order refunded email", result);
        return result;
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
    console.log(items.map((item) => item._id));
    let dbItems = await mongoose.model('ShopItem').find({ _id: items.map((item) => item._id) }).lean();
    let newItems = items.map((item) => {
        const index = findIndex(dbItems, item._id);
        if (index === -1)
            return null;
        const dbItem = dbItems[index];
        if (dbItem.status === "ARCHIVED" || dbItem.status === "DELETED")
            return null;

        // Override item fields
        Object.assign(item, dbItem);
        item.price = dbItem.price;

        let maxQuantity = Math.min(item.stock == null ? Infinity : item.stock, item.limit || Infinity);
        if (item.quantity > maxQuantity)
            item.quantity = maxQuantity;

        // Remove 0 quantity items
        if (!item.quantity)
            return null;

        return item;
    }).filter((item) => item != null);
    return newItems;
}

function findIndex(items, _id) {
    for (let i = 0; i < items.length; i++) {
        if (String(items[i]._id) === _id)
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