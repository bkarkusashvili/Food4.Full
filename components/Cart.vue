<template>
  <div class="cart">
    <div class="cart-items">
      <cart-item :item="item" v-for="item in items" :key="item._id" />
    </div>

    <div class="cart-controls" v-if="items.length">
      <div class="has-text-centered">
        სულ:
        <strong>{{$store.getters['cart/total'] | price}} ₾</strong>
      </div>

      <div class="cart-controls flex flex-row">
        <nuxt-link to="/cart" class="button flex-grow-1" style="flex-basis: 50%">
          <span class="icon">
            <i class="mdi mdi-cart"></i>
          </span>
          <span>სრულად</span>
        </nuxt-link>
        <span class="separator" style="width: .5em"></span>
        <nuxt-link to="/order" class="button is-black flex-grow-1"  style="flex-basis: 50%">
          <span class="icon">
            <i class="mdi mdi-shopping"></i>
          </span>
          <span>ყიდვა</span>
        </nuxt-link>
      </div>
    </div>

    <div class="cart-no-items has-text-centered" v-else>
      <p>თქვენი კალათა ცარიელია</p>
      <nuxt-link to="/shop">მაღაზიაზე გადასვლა</nuxt-link>
    </div>
  </div>
</template>

<script>
import CartItem from "./CartItem";

const watchedActions = ["cart/setQuantity", "cart/add", "cart/remove"];

export default {
  components: { CartItem },
  data() {
    return {};
  },
  mounted() {
    let saveCartDebounced = debounce(() => {
      this.saveCart();
    }, 1000);
    this.$store.subscribe((mutation, state) => {
      if (watchedActions.indexOf(mutation.type) !== -1) saveCartDebounced();
    });
    this.fetchCart();
  },
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
    },
    saveCart() {
      if (this.$store.state.auth.user) {
        this.$axios
          .put("/api/user/cart", { items: this.items })
          .then(response => {
            console.log("Saved cart to server");
          })
          .catch(err => console.error(err));
      } else if (process.client) {
        localStorage.setItem("cartItems", JSON.stringify(this.items));
        console.log("Saved cart to localStorage");
      }
    }
  }
};

function debounce(func, delay) {
  let inDebounce;
  return function() {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(func, delay);
  };
}
</script>

<style>
.cart {
  min-width: 300px;
}

.cart .cart-controls {
  background: #eeeeee;
  padding: 5px;
}

.cart .cart-items {
  padding: 5px;
}
</style>