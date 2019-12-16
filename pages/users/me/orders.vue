<template>
  <div class="user-orders">
    <table class="table is-fullwidth is-hoverable">
      <tr>
        <th>თარიღი</th>
        <th>ჩამონათვალი</th>
        <th>სულ</th>
        <th>სტატუსი</th>
      </tr>
      <tr v-for="(order, index) in orders" :key="index">
        <td>
          <nuxt-link :to="'/orders/' + order._id">{{order.createdAt | date}}</nuxt-link>
        </td>
        <td>
          <div v-for="(item, itemIndex) in order.items" :key="itemIndex">
            <img
              :src="item.thumb"
              alt
              v-if="item.thumb"
              style="max-width: 5em; max-height: 5em; vertical-align: middle"
            />
            {{item.title}} x {{item.quantity}}
          </div>
        </td>
        <td>
          <strong>{{order.amount}} ₾</strong>
        </td>
        <td>
          <div class="has-text-grey" v-if="order.status === 'PAYMENT_PENDING'">გადასახდელია</div>
          <div class="has-text-info" v-if="order.status === 'PAID'">გადახდილია</div>
          <div class="has-text-primary" v-if="order.status === 'SHIPPED'">გამოგზავნილია</div>
          <div class="has-text-success" v-if="order.status === 'FINISHED'">მიღებულია</div>
          <div class="has-text-danger" v-if="order.status === 'CANCELLED'">გაუქმებულია</div>
        </td>
      </tr>
    </table>

    <pagination :page="page" :total="total" :per-page="perPage" @goto="gotoPage" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      orders: [],
      page: 1,
      total: 1,
      perPage: 12
    };
  },
  methods: {
    fetchData() {
      this.$axios
        .get("/api/user/orders", { params: this.queryParams() })
        .then(response => {
          this.orders = response.data;
          let total = response.headers["x-total-count"];
          if (!isNaN(total)) this.total = parseInt(total);
        })
        .catch(err => {
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
    },
    gotoPage(page) {
      this.page = parseInt(page);
      this.fetchData();
    },
    queryParams() {
      return {
        offset: (this.page - 1) * this.perPage,
        limit: this.perPage
      };
    }
  },
  asyncData({ params, error, $axios }) {
    return $axios
      .get("/api/user/orders")
      .then(response => {
        let total = response.headers["x-total-count"];
        if (!isNaN(total)) total = parseInt(total);

        return { orders: response.data, total: total };
      })
      .catch(err => {
        error({ statusCode: 500, message: "მოხდა შეცდომა!" });
      });
  }
};
</script>

<style>
.user-orders table td {
  vertical-align: middle;
}
</style>