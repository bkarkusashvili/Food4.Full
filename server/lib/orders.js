const mongoose = require('mongoose'),
    payments = require('./payments');

async function createOrder(orderParams, user) {
    let items = await syncItems(orderParams.items);
    if (!items.length)
        throw new Error("შეკვეთა ცარიელია!");
    let order = new mongoose.model('ShopOrder')({
        address: orderParams.address,
        items: items,
        user: user,
        amount: getTotal(items),
        status: "CREATED"
    });
    return order.save();
}

async function payOrder(orderId) {
    let order = await mongoose.model('ShopOrder').findById(orderId);
    if (!order)
        return;
    let paymentResult = await payments.orderRequest(order);
    order.payment = paymentResult;
    order.status = "PAYMENT_PENDING";
    await order.save();
    return order;
}

async function checkOrder(orderId, user) {
    let order = await mongoose.model('ShopOrder').findOne(user ? { _id: orderId, user: user._id } : { _id: orderId });
    if (!order)
        return;
    let paymentResult = await payments.checkOrder(order);

    console.log(paymentResult);

    if(order.status === "CREATED" || order.status === "PAYMENT_PENDING") {
        order.status = "PAID";
        await reserveItems(order.items);
        await order.save();
    }

    return order;
}

async function cancelOwnOrder(orderId, user) {
    let order = await mongoose.model('ShopOrder').findOne({ _id: orderId, user: user._id });
    if (order.status !== "CREATED")
        throw new Error("შეკვეთის გასაუქმებლად მიმართეთ ადმინისტრაციას!");
    order.status = "CANCELLED";
    return order.save();
}

async function cancelOrder(orderId) {
    let order = await mongoose.model('ShopOrder').findById(orderId);
    if (!order)
        return;
    if (order.status === "PAID") {
        await unreserveItems(order.items);
        await payments.refundRequest(order);
    }

    order.status = "CANCELLED";

    return order.save();
}

async function updateOrder(orderId, orderParams) {
    let order = await mongoose.model('ShopOrder').findById(orderId);
    if (!order)
        return;
    Object.assign(order, orderParams);
    return order.save();
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

module.exports = { createOrder, payOrder, cancelOwnOrder, cancelOrder, updateOrder, syncItems, checkOrder };