export const state = () => ({
    items: []
});

export const getters = {
    itemCount(state) {
        return state.items.reduce((sum, item) => sum + item.quantity, 0);
    }
}

export const mutations = {
    add(state, item) {
        let index = findIndex(state.items, item._id);
        if (index !== -1) {
            state.items(index).quantity += 1;
            return;
        }

        state.items.push({
            _id: item._id,
            name: item.name,
            item: item,
            quantity: 1
        });
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
        if (index !== -1)
            state.items[index].quantity = quantity;
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