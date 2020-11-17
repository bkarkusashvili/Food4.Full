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
        <div class="control" v-if="!selectedUser">
          <button type="button" class="button" @click="showUserChooser=true">
            <span class="icon">
              <i class="mdi mdi-face"></i>
            </span>
            <span>მომხმარებლით გაფილტრვა</span>
          </button>
        </div>
        <div class="field has-addons" v-else>
          <div class="control">
            <button type="button" class="button" @click="showUserChooser=true">
              <span class="icon">
                <i class="mdi mdi-face"></i>
              </span>
              <span>{{selectedUser.name}}</span>
            </button>
          </div>
          <div class="control">
            <button type="button" class="button is-danger" @click="clearUser">x</button>
          </div>
        </div>
        <!-- <div class="control">
          <input type="text" class="input" v-model="filter.q" placeholder="სათაური" />
        </div>-->
      </div>
    </form>
    <table class="table is-fullwidth is-hoverable">
      <tr>
        <th style="width: 8em">თარიღი</th>
        <th>ჩამონათვალი</th>
        <th>მისამართი</th>
        <th style="width: 6em">სულ</th>
        <th style="width: 8em">სტატუსი</th>
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
          <strong>{{order.amount | price}} ₾</strong>
        </td>
        <td>
          <div class="has-text-grey" v-if="order.status === 'CREATED'">შექმნილი</div>
          <div class="has-text-grey" v-if="order.status === 'PAYMENT_PENDING'">გადასახდელი</div>
          <div class="has-text-info" v-if="order.status === 'PAID'">გადახდილი</div>
          <div class="has-text-primary" v-if="order.status === 'SHIPPED'">გაგზავნილი</div>
          <div class="has-text-success" v-if="order.status === 'FINISHED'">დასრულებული</div>
          <div class="has-text-danger" v-if="order.status === 'CANCELLED'">გაუქმებული</div>
        </td>
        <td class="has-text-centered" style="line-height: 2">
          <div class="dropdown is-hoverable is-right">
            <div class="dropdown-trigger">
              <button class="button is-primary" aria-haspopup="true" aria-controls="dropdown-menu">
                <span>მოქმედება</span>
                <span class="icon">
                  <i class="mdi mdi-chevron-down" aria-hidden="true"></i>
                </span>
              </button>
            </div>
            <div class="dropdown-menu" id="dropdown-menu" role="menu">
              <div class="dropdown-content">
                <a
                  class="dropdown-item has-text-success"
                  @click="setStatus(order, 'SHIPPED')"
                  v-show="order.status === 'PAID'"
                >გაგზავნილია</a>
                <a
                  class="dropdown-item has-text-success"
                  @click="setStatus(order, 'FINISHED')"
                  v-show="order.status === 'SHIPPED'"
                >დასრულებულია</a>
                <a
                  class="dropdown-item has-text-info"
                  @click="checkOrder(order)"
                  v-show="order.status !== 'CREATED'"
                >გადახდის შემოწმება</a>
                <a
                  class="dropdown-item has-text-primary"
                  @click="showChangeStatus(order)"
                >სტატუსის შეცვლა</a>
                <a
                  class="dropdown-item has-text-danger"
                  @click="cancelOrder(order)"
                  v-show="order.status !== 'CANCELLED'"
                >გაუქმება</a>
              </div>
            </div>
          </div>
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
    <user-chooser :show="showUserChooser" @hide="showUserChooser = false" @select="userSelected" />
  </div>
</template>

<script>
import OrderStatusChanger from "../../../../components/OrderStatusChanger";
import UserChooser from "../../../../components/UserChooser";

export default {
  components: { OrderStatusChanger, UserChooser },
  data() {
    return {
      orders: [],
      page: 1,
      total: 1,
      perPage: 20,
      filter: {
        status: null,
        user: null
      },
      showOrderStatusChanger: false,
      showUserChooser: false,
      selectedUser: null,
      orderToChange: null
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    cancelOrder(order) {
      if (!confirm("დარწმუნებული ხართ რომ გინდათ შეკვეთის გაუქმება?")) return;
      this.$axios
        .post("/api/admin/shop/orders/" + order._id + "/cancel")
        .then(response => {
          this.$notifySuccess({
            title: "შეკვეთა გაუქმებულია"
          });
          Object.assign(order, response.data);
        })
        .catch(err => {
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
    },
    showChangeStatus(order) {
      this.orderToChange = order;
      this.showOrderStatusChanger = true;
    },
    orderStatusChanged(status) {
      this.setStatus(this.orderToChange, status);
    },
    userSelected(user) {
      this.selectedUser = user;
      this.filter.user = user._id;
    },
    clearUser() {
      this.selectedUser = null;
      this.filter.user = null;
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
        .put("/api/admin/shop/orders/" + order._id + "/status", {
          status: status
        })
        .then(response => {
          this.$notifySuccess({
            title: "სტატუსი შეცვლილია"
          });
          Object.assign(order, response.data);
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
          this.$notifySuccess({
            title: "შემოწმება დასრულებულია"
          });
          Object.assign(order, response.data);
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
    "filter.status": "fetchData",
    "filter.user": "fetchData"
  }
};
</script>

<style>
</style>
