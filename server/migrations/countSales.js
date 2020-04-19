const mongoose = require('mongoose');
module.exports = function () {
    const ShopOrder = mongoose.model('ShopOrder');
    const ShopItem = mongoose.model('ShopItem');
    return ShopOrder.find({
        status: "FINISHED"
    }).then(function(orders) {
        return Promise.all(orders.map((order) => {
            console.log("Order", order._id);
            return Promise.all(order.items.map((item) => {
                console.log("Order", order._id, "item", item._id, item.quantity);
                return ShopItem.findByIdAndUpdate(item._id, {
                    $inc: {
                        sold: item.quantity,
                    }
                });
            }))
        }));
    });
}