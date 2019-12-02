<template>
  <div class="cart">
    <cart-item :item="item" v-for="item in items" :key="item._id" />
  </div>
</template>

<script>
import CartItem from "./CartItem";

export default {
  components: { CartItem },
  data() {
    return {};
  },
  mounted() {
    this.fetchCart();
  },
  computed: {
    items() {
      return this.$store.state.cart.items;
    }
  },
  methods: {
    fetchCart() {
      this.$axios
        .get("/api/user/cart")
        .then(response => {
          this.$store.commit("cart/setItems", response.data.items);
        })
        .catch(err => console.error(err));
    }
  }
};
</script>

<style>
.cart {
    min-width: 250px;
    padding: 5px 10px;
}
</style>