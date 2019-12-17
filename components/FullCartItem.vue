<template>
  <div class="full-cart-item flex flex-row flex-align-items-center">
    <div class="cart-item-thumb">
      <img :src="item.thumb | youtubeThumb" alt />
    </div>
    <div class="flex-grow-1">
      <a class="cart-item-name" target="_blank" :href="'/shop/items/' + item.slug">{{item.title}}</a>
      <br />
      ფასი: {{item.price | price}} ₾
    </div>
    <div class="has-text-centered">
      <div class="field has-addons">
        <button type="button" class="button is-small is-white" @click="decrement()">-</button>
        <strong class="cart-item-quantity">{{item.quantity}}</strong>
        <button type="button" class="button is-small is-white" @click="increment()">+</button>
      </div>
      <button type="button" class="button cart-item-remove is-small is-danger" @click="remove()">
        <span class="icon">
          <i class="mdi mdi-close"></i>
        </span>
        <span>წაშლა</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "full-cart-item",
  props: {
    item: Object
  },
  methods: {
    remove() {
      if (!confirm("ნამდვილად გსურთ წაშლა?")) return;
      this.$store.commit("cart/remove", this.item._id);
    },
    increment() {
      this.$store.commit("cart/setQuantity", {
        _id: this.item._id,
        quantity: this.item.quantity + 1
      });
    },
    decrement() {
      if (this.item.quantity === 1) return this.remove();

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

<style lang="scss">
.full-cart-item {
  .cart-item-thumb {
    max-width: 10em;
    height: auto;
    padding-right: 15px;
  }

  .cart-item-quantity {
    width: 2em;
    text-align: center;
    line-height: 30px;
    font-size: 28px;
  }

  .cart-item-name {
    line-height: 30px;
    font-size: 32px;
    color: black;
  }
}
</style>