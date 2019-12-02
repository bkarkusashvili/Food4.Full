<template>
  <div>
    <span>{{item.name}}</span>
    <button type="button" class="button is-rounded" @click="decrement()">-</button>
    <strong>{{item.quantity}}</strong>
    <button type="button" class="button is-rounded" @click="increment()">+</button>
  </div>
</template>

<script>
export default {
  name: "cart-item",
  props: {
    item: Object
  },
  methods: {
    increment() {
      this.$store.commit("cart/setQuantity", { _id: this.item._id, quantity: this.item.quantity + 1});
    },
    decrement() {
      this.$store.commit("cart/setQuantity", { _id: this.item._id, quantity: this.item.quantity - 1});
    }
  }
};
</script>

<style>
</style>