export const state = () => ({
    items: []
});

export const getters = {
    itemCount(state) {
        return state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    total(state) {
        return state.items.reduce((sum, item) => {
            if (!item.quantity || !item.price)
                return sum;
            return sum + Math.ceil(item.quantity * item.price)
        }, 0);
    }
}

export const mutations = {
    add(state, item) {
        let index = findIndex(state.items, item._id);
        if (index !== -1) {
            limitQuantity(state.items[index], state.items[index].quantity + 1);
            return;
        }

        state.items.push(Object.assign({}, item, {
            quantity: 1
        }));
    },
    remove(state, _id) {
        let index = findIndex(state.items, _id);
        if (index !== -1)
            state.items.splice(index, 1);
    },
    setQuantity(state, { _id, quantity }) {
        if (quantity < 1)
            return mutations.remove(state, _id);

        let index = findIndex(state.items, _id);
        if (index !== -1) {
            limitQuantity(state.items[index], quantity);
        }
    },
    setItems(state, items) {
        state.items = items;
    }
}

export const actions = {
}

function findIndex(items, _id) {
    for (let i = 0; i < items.length; i++) {
        if (items[i]._id === _id)
            return i;
    }
    return -1;
}

function limitQuantity(item, quantity) {
    let maxQuantity = Math.min(item.stock == null ? Infinity : item.stock, item.limit || Infinity);
    if (quantity >= maxQuantity)
        item.quantity = maxQuantity;
    else
        item.quantity = quantity;
}