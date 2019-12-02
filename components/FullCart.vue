<template>
  <div class="full-cart">
    <full-cart-item :item="item" v-for="item in items" :key="item._id" />

    <div class="field is-grouped" v-if="items.length && buttons">
      <div class="control is-expanded">
        <nuxt-link to="/order/start" class="button is-black is-large">
          <span class="icon">
            <i class="mdi mdi-shopping"></i>
          </span>
          <span>ყიდვა</span>
        </nuxt-link>
      </div>
    </div>
    <div class="cart-no-items has-text-centered" v-if="!items.length">
      <p>თქვენი კალათა ცარიელია</p>
      <nuxt-link to="/shop">მაღაზიაზე გადასვლა</nuxt-link>
    </div>
  </div>
</template>

<script>
import FullCartItem from "./FullCartItem";

export default {
  components: { FullCartItem },
  props: {
    buttons: Boolean
  },
  data() {
    return {};
  },
  mounted() {},
  computed: {
    items() {
      return this.$store.state.cart.items;
    }
  },
  methods: {
    fetchCart() {
      if (this.$store.state.auth.user) {
        this.$axios
          .get("/api/user/cart")
          .then(response => {
            let items = response.data.items;
            if (items != null) {
              this.$store.commit("cart/setItems", items);
              console.log("Restored cart from server");
            }
          })
          .catch(err => console.error(err));
      } else if (process.client) {
        let items = JSON.parse(localStorage.getItem("cartItems"));
        if (items != null) {
          this.$store.commit("cart/setItems", items);
          console.log("Restored cart from localStorage");
        }
      }
    }
  }
};
</script>

<style>
/* .full-cart {
  min-width: 250px;
  padding: 5px 10px;
} */
</style>