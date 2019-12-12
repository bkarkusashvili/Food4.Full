<template>
  <div class="order-page">
    <div class="container">
      <div
        class="has-text-centered notification is-danger"
        v-if="order.status === 'CANCELLED'"
      >
        <h1 class="title">შეკვეთა გაუქმებულია</h1>
        <nuxt-link to="/">მთავარ გვერდზე დაბრუნება</nuxt-link>
      </div>
      <div class="has-text-centered notification is-success" v-if="order.status === 'PAID'">
        <h1 class="title">გადახდა შესრულდა წარმატებით!</h1>
        <nuxt-link :to="'/orders/' + order._id">გადასვლა შეკვეთაზე</nuxt-link>
      </div>
      <div
        class="has-text-centered notification is-info"
        v-if="order.status === 'PAYMENT_PENDING'"
      >
        <h1 class="title">გადახდა დასრულებული არ არის</h1>
      </div>
      <div class="has-text-centered" style="padding-bottom: 2em">
        <button
          class="button is-medium is-danger"
          v-show="canCancelOrder"
          :disabled="loading"
          @click="cancelOrder"
        >
          <span class="icon">
            <i class="mdi mdi-cancel"></i>
          </span>
          <span>შეკვეთის გაუქმება</span>
        </button>
        <button
          class="button is-medium is-primary"
          :disabled="loading"
          @click="checkOrder"
          v-show="canCheckOrder"
        >
          <span class="icon">
            <i class="mdi mdi-refresh" :class="{'spin': loading}"></i>
          </span>
          <span>შემოწმება</span>
        </button>
        <button
          class="button is-medium is-success"
          v-show="canPayOrder"
          :disabled="loading"
          @click="payOrder"
        >
          <span class="icon">₾</span>
          <span>გადახდა</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      order: {},
      loading: false
    };
  },
  computed: {
    canPayOrder() {
      let canPay = false;
      if (
        this.order.status === "PAYMENT_PENDING" &&
        this.order.payment &&
        this.order.payment.links
      ) {
        this.order.payment.links.forEach(link => {
          canPay = true;
        });
      }
      return canPay;
    },
    canCancelOrder() {
      return (
        this.order.status === "PAYMENT_PENDING" ||
        this.order.status === "CREATED"
      );
    },
    canCheckOrder() {
      return this.order.status !== "CANCELLED";
    }
  },
  mounted() {
    this.checkOrder();
  },
  asyncData({ query, error, $axios }) {
    return $axios
      .get("/api/user/orders/" + query.id)
      .then(response => {
        return { order: response.data };
      })
      .catch(err => {
        error({ statusCode: 404, message: "გვერდი ვერ მოიძებნა" });
      });
  },
  methods: {
    checkOrder() {
      this.loading = true;
      this.$axios
        .put("/api/user/orders/" + this.order._id + "/check")
        .then(response => {
          this.loading = false;
          this.order = response.data;
          if (this.order.status === "PAID")
            setTimeout(() => {
              this.$router.replace("/orders/" + this.order._id);
            }, 1000);
        })
        .catch(err => {
          this.loading = false;
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
    },
    payOrder() {
      if (this.order.payment && this.order.payment.links) {
        let redirectLink = null;
        this.order.payment.links.forEach(link => {
          if (link.rel === "approve") redirectLink = link.href;
        });
        if (redirectLink) location.href = redirectLink;
      }
    },
    cancelOrder() {
      this.loading = true;
      this.$axios
        .put("/api/user/orders/" + this.order._id + "/cancel")
        .then(response => {
          this.loading = false;
          this.order = response.data;
        })
        .catch(err => {
          this.loading = false;
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
    }
  }
};
</script>

<style>
</style>