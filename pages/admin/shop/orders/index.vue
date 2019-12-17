<template>
  <div>
    <form class="form">
      <div class="field is-grouped">
        <div class="control">
          <div class="select">
            <select v-model="filter.status">
              <option :value="null">აქტიური</option>
              <option value="CREATED">შექმნილი</option>
              <option value="PAYMENT_PENDING">გადასახდელი</option>
              <option value="PAID">გადახდილი</option>
              <option value="SHIPPED">გაგზავნილი</option>
              <option value="FINISHED">დასრულებული</option>
              <option value="CANCELLED">გაუქმებული</option>
            </select>
          </div>
        </div>
        <!-- <div class="control">
          <input type="text" class="input" v-model="filter.q" placeholder="სათაური" />
        </div>-->
      </div>
    </form>
    <table class="table is-fullwidth is-hoverable">
      <tr>
        <th>თარიღი</th>
        <th>ჩამონათვალი</th>
        <th>მისამართი</th>
        <th>სულ</th>
        <th>სტატუსი</th>
        <th></th>
      </tr>
      <tr v-for="(order, index) in orders" :key="index">
        <td>
          <nuxt-link :to="'/admin/shop/orders/' + order._id">{{order.createdAt | dateTime}}</nuxt-link>
        </td>
        <td>
          <div
            v-for="(item, itemIndex) in order.items"
            :key="itemIndex"
          >{{item.title}} x {{item.quantity}}</div>
        </td>
        <td>
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
        </td>
        <td>
          <strong>{{order.amount}} ₾</strong>
        </td>
        <td>
          <div class="has-text-grey" v-if="order.status === 'CREATED'">შექმნილია</div>
          <div class="has-text-grey" v-if="order.status === 'PAYMENT_PENDING'">გადასახდელია</div>
          <div class="has-text-info" v-if="order.status === 'PAID'">გადახდილია</div>
          <div class="has-text-primary" v-if="order.status === 'SHIPPED'">გამოგზავნილია</div>
          <div class="has-text-success" v-if="order.status === 'FINISHED'">მიღებულია</div>
          <div class="has-text-danger" v-if="order.status === 'CANCELLED'">გაუქმებულია</div>
        </td>
        <td class="has-text-centered" style="line-height: 2">
          <div v-if="order.status === 'PAYMENT_PENDING'">
            <button
              type="button"
              class="button is-info is-small"
              @click="checkOrder(order)"
            >შემოწმება</button>
          </div>
          <button
            type="button"
            class="button is-primary is-small"
            @click="showChangeStatus(order)"
          >სტატუსის შეცვლა</button>
          <br />
          <button
            type="button"
            class="button is-danger is-small"
            @click="cancelOrder(order)"
          >გაუქმება</button>
        </td>
      </tr>
    </table>

    <pagination :page="page" :total="total" :per-page="perPage" @goto="gotoPage" />

    <order-status-changer
      :show="showOrderStatusChanger"
      @hide="showOrderStatusChanger = false"
      @select="orderStatusChanged"
      :order="orderToChange"
    />
  </div>
</template>

<script>
import OrderStatusChanger from "../../../../components/OrderStatusChanger";

export default {
  components: { OrderStatusChanger },
  data() {
    return {
      orders: [],
      page: 1,
      total: 1,
      perPage: 20,
      filter: {
        status: null
      },
      showOrderStatusChanger: false,
      orderToChange: null
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    cancelOrder(order) {
      if (!confirm("დარწმუნებული ხართ რომ გინდათ შეკვეთის გაუქმება?")) return;
      this.setStatus(order, "CANCELLED");
    },
    showChangeStatus(order) {
      this.orderToChange = order;
      this.showOrderStatusChanger = true;
    },
    orderStatusChanged(status) {
      this.setStatus(this.orderToChange, status);
    },
    fetchData() {
      this.$axios
        .get("/api/admin/shop/orders", { params: this.queryParams() })
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
    setStatus(order, status) {
      this.$axios
        .put("/api/admin/shop/orders/" + order._id + "/status")
        .then(response => {
          this.fetchData();
        })
        .catch(err => {
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
    },
    checkOrder(order) {
      this.$axios
        .post("/api/admin/shop/orders/" + order._id + "/check")
        .then(response => {
          this.fetchData();
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
      return Object.assign({}, this.filter, {
        offset: (this.page - 1) * this.perPage,
        limit: this.perPage
      });
    }
  },
  watch: {
    "filter.status": "fetchData"
  }
};
</script>

<style>
</style>