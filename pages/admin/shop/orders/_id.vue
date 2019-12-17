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
    </div>

    <order-payment-log :show="showPaymentLog" @hide="showPaymentLog = false" :order="order" />
  </div>
</template>

<script>
import OrderPaymentLog from "../../../../components/OrderPaymentLog";

export default {
  components: { OrderPaymentLog },
  data() {
    return {
      order: {},
      showPaymentLog: false
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
  methods: {},
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