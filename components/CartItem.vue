<template>
  <div class="cart-item columns">
    <div class="column">
      <label class="label">{{item.name}}</label>
    </div>
    <div class="column is-narrow">
      <div class="field has-addons">
        <div class="control">
          <button type="button" class="button is-small is-rounded" @click="decrement()">-</button>
        </div>
        <div class="control">
          <input
            style="width: 4em"
            type="number"
            class="input is-small"
            :value="item.quantity"
            @input="setQuantity($event.target.value)"
          />
        </div>
        <div class="control">
          <button type="button" class="button is-small is-rounded" @click="increment()">+</button>
        </div>
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
</style>