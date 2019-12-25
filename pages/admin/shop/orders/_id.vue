<template>
  <div class="order-page">
    <div class="container">
      <h1 class="title has-text-centered">შეკვეთა</h1>

      <div class="columns">
        <div class="column">
          <div class="box">
            <h2 class="subtitle">ინფორმაცია</h2>

            <table class="table is-fullwidth">
              <tr>
                <th>სტატუსი</th>
                <td>
                  <div class="has-text-grey" v-if="order.status === 'CREATED'">შექმნილია</div>
                  <div class="has-text-grey" v-if="order.status === 'PAYMENT_PENDING'">გადასახდელია</div>
                  <div class="has-text-info" v-if="order.status === 'PAID'">გადახდილია</div>
                  <div class="has-text-primary" v-if="order.status === 'SHIPPED'">გამოგზავნილია</div>
                  <div class="has-text-success" v-if="order.status === 'FINISHED'">მიღებულია</div>
                  <div class="has-text-danger" v-if="order.status === 'CANCELLED'">გაუქმებულია</div>
                </td>
              </tr>
              <tr>
                <th>თარიღი</th>
                <td>{{order.createdAt | dateTime}}</td>
              </tr>
              <tr>
                <th>გადახდის ლოგი</th>
                <td>
                  <a @click="showPaymentLog = true">ჩვენება</a>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div class="column" v-if="order.user">
          <div class="box">
            <h2 class="subtitle">მომხმარებელი</h2>
            <table class="table is-fullwidth">
              <tr>
                <th>სახელი</th>
                <td>{{order.user.name}}</td>
              </tr>
              <tr>
                <th>ელ-ფოსტა</th>
                <td>{{order.user.email}}</td>
              </tr>
              <tr>
                <th>დარეგისტრირდა</th>
                <td>{{order.user.createdAt | dateTime}}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <div class="box">
            <h2 class="subtitle">ჩამონათვალი</h2>
            <table class="table is-fullwidth">
              <tr v-for="(item, index) in order.items" :key="index">
                <td>
                  <nuxt-link :to="'/shop/items/' + item.slug">{{item.title}}</nuxt-link>
                </td>
                <td class="has-text-right">{{item.price | price}} ₾</td>
                <td class="has-text-right">{{item.quantity}} ცალი</td>
              </tr>
              <tr>
                <th>სულ</th>
                <th class="has-text-right">{{order.amount | price}} ₾</th>
                <th class="has-text-right">{{itemCount}} ცალი</th>
              </tr>
            </table>
          </div>
        </div>
        <div class="column">
          <div class="box" v-if="order.address">
            <h2 class="subtitle">მისამართი</h2>
            <div>
              <i class="mdi mdi-account"></i>
              {{order.address.name}} {{order.address.surname}}
            </div>
            <div>
              <i class="mdi mdi-phone"></i>
              {{order.address.phone}}
              <i class="mdi mdi-city"></i>
              {{order.address.city}}
            </div>
            <div>
              <i class="mdi mdi-home"></i>
              {{order.address.address}}
            </div>
          </div>
        </div>
      </div>

      <div class="field is-grouped is-grouped-centered">
        <div class="control">
          <button
            type="button"
            class="button is-success"
            @click="setStatus(order, 'SHIPPED')"
            v-show="order.status === 'PAID'"
          >გაგზავნილია</button>
        </div>
        <div class="control">
          <button
            type="button"
            class="button is-success"
            @click="setStatus(order, 'FINISHED')"
            v-show="order.status === 'SHIPPED'"
          >დასრულებულია</button>
        </div>
        <div class="control">
          <button
            type="button"
            class="button is-info"
            @click="checkOrder(order)"
            v-show="order.status !== 'CREATED'"
          >გადახდის შემოწმება</button>
        </div>
        <div class="control">
          <button
            type="button"
            class="button is-primary"
            @click="showChangeStatus(order)"
          >სტატუსის შეცვლა</button>
        </div>
        <div class="control">
          <button
            type="button"
            class="button is-danger"
            @click="cancelOrder(order)"
            v-show="order.status !== 'CANCELLED'"
          >გაუქმება</button>
        </div>
      </div>
    </div>

    <order-status-changer
      :show="showOrderStatusChanger"
      @hide="showOrderStatusChanger = false"
      @select="orderStatusChanged"
      :order="order"
    />
    <order-payment-log :show="showPaymentLog" @hide="showPaymentLog = false" :order="order" />
  </div>
</template>

<script>
import OrderPaymentLog from "../../../../components/OrderPaymentLog";
import OrderStatusChanger from "../../../../components/OrderStatusChanger";

export default {
  components: { OrderPaymentLog, OrderStatusChanger },
  data() {
    return {
      order: {},
      showPaymentLog: false,
      showOrderStatusChanger: false
    };
  },
  asyncData({ params, error, $axios }) {
    return $axios
      .get("/api/admin/shop/orders/" + params.id)
      .then(response => {
        return { order: response.data };
      })
      .catch(err => {
        error({ statusCode: 404, message: "გვერდი ვერ მოიძებნა" });
      });
  },
  methods: {
    cancelOrder() {
      if (!confirm("დარწმუნებული ხართ რომ გინდათ შეკვეთის გაუქმება?")) return;
      this.$axios
        .post("/api/admin/shop/orders/" + this.order._id + "/cancel")
        .then(response => {
          this.$notifySuccess({
            title: "შეკვეთა გაუქმებულია"
          });
          Object.assign(this.order, response.data);
        })
        .catch(err => {
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
    },
    showChangeStatus() {
      this.showOrderStatusChanger = true;
    },
    orderStatusChanged(status) {
      this.setStatus(status);
    },
    fetchData() {
      this.$axios
        .get("/api/admin/shop/orders/" + this.$route.params.id)
        .then(response => {
          this.order = response.data;
        })
        .catch(err => {
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
    },
    setStatus(status) {
      this.$axios
        .put("/api/admin/shop/orders/" + this.order._id + "/status", {
          status: status
        })
        .then(response => {
          this.$notifySuccess({
            title: "სტატუსი შეცვლილია"
          });
          Object.assign(this.order, response.data);
        })
        .catch(err => {
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
    },
    checkOrder() {
      this.$axios
        .post("/api/admin/shop/orders/" + this.order._id + "/check")
        .then(response => {
          this.$notifySuccess({
            title: "შემოწმება დასრულებულია"
          });
          Object.assign(this.order, response.data);
        })
        .catch(err => {
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
    }
  },
  computed: {
    itemCount() {
      if (!this.order || !this.order.items) return 0;
      return this.order.items.reduce((sum, item) => {
        if (!item.quantity) return sum;
        return sum + item.quantity;
      }, 0);
    }
  },
  head() {
    return {
      meta: [{ name: "robots", content: "noindex,nofollow" }]
    };
  }
};
</script>

<style>
.order-page {
  padding-bottom: 1em;
}
</style>