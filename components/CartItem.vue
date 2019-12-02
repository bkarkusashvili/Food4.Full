<template>
  <div class="cart-item columns">
    <div class="column">
      <button type="button" class="button is-small is-white" @click="remove()">
        <i class="mdi mdi-close"></i>
      </button>
      <nuxt-link class="cart-item-name" to="/shop/items/">{{item.name}}</nuxt-link>
    </div>
    <div class="column is-narrow">
      <div class="field has-addons">
        <button type="button" class="button is-small is-white" @click="decrement()">-</button>
        <strong class="cart-item-quantity">{{item.quantity}}</strong>
        <button type="button" class="button is-small is-white" @click="increment()">+</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "cart-item",
  props: {
    item: Object
  },
  methods: {
    remove() {
      this.$store.commit("cart/remove", this.item._id);
    },
    increment() {
      this.$store.commit("cart/setQuantity", {
        _id: this.item._id,
        quantity: this.item.quantity + 1
      });
    },
    decrement() {
      this.$store.commit("cart/setQuantity", {
        _id: this.item._id,
        quantity: this.item.quantity - 1
      });
    },
    setQuantity(quantity) {
      quantity = parseInt(quantity);
      this.$store.commit("cart/setQuantity", {
        _id: this.item._id,
        quantity: quantity
      });
    }
  }
};
</script>

<style>
.cart-item-quantity {
  width: 2em;
  text-align: center;
  line-height: 30px;
}

.cart-item-name {
  line-height: 30px;
  color: black;
}
</style>