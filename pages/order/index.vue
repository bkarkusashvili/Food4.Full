<template>
  <div class="order-page">
    <div class="container">
      <ul class="steps is-narrow is-medium is-centered has-content-centered">
        <li class="steps-segment" :class="{'is-active': step === 'cart'}">
          <span class="steps-marker">
            <span class="icon">
              <i class="mdi mdi-cart"></i>
            </span>
          </span>
          <div class="steps-content">
            <p class="heading">კალათა</p>
          </div>
        </li>
        <li class="steps-segment" :class="{'is-active': step === 'address'}">
          <span class="steps-marker">
            <span class="icon">
              <i class="mdi mdi-truck"></i>
            </span>
          </span>
          <div class="steps-content">
            <p class="heading">მისამართი</p>
          </div>
        </li>
        <li class="steps-segment" :class="{'is-active': step === 'payment'}">
          <span class="steps-marker">
            <span class="icon">₾</span>
          </span>
          <div class="steps-content">
            <p class="heading">გადახდა</p>
          </div>
        </li>
      </ul>

      <div class="columns" v-if="step === 'cart'">
        <div class="column">
          <full-cart />
        </div>

        <div class="column is-4 order-sidebar">
          <div class="has-text-centered">
            სულ:
            <strong>{{$store.getters['cart/total'] | price}} ₾</strong>
          </div>
          <div class="has-text-centered">
            <button
              class="button is-large is-success"
              @click="gotoAddress()"
              :disabled="$store.getters['cart/itemCount'] === 0"
            >
              <span>გაგრძელება</span>
              <span class="icon">
                <i class="mdi mdi-chevron-right"></i>
              </span>
            </button>
          </div>
        </div>
      </div>
      <div class="columns" v-if="step === 'address'">
        <div class="column">
          <div class="field">
            <label class="label">სახელი</label>
            <div class="control">
              <input
                v-model="address.surname"
                class="input"
                type="text"
                :class="{'is-danger': !nameValid}"
              />
            </div>
            <p v-show="!addressValid" class="help is-danger">გთხოვთ შეიყვანოთ სახელი</p>
          </div>

          <div class="field">
            <label class="label">გვარი</label>
            <div class="control">
              <input
                v-model="address.name"
                class="input"
                type="text"
                :class="{'is-danger': !surnameValid}"
              />
            </div>
            <p v-show="!addressValid" class="help is-danger">გთხოვთ შეიყვანოთ გვარი</p>
          </div>

          <div class="field">
            <label class="label">ტელეფონი</label>
            <div class="control has-icons-left">
              <input
                v-model="address.phone"
                class="input"
                :class="{'is-danger': !phoneValid}"
                type="tel"
              />
              <span class="icon is-small is-left">
                <i class="mdi mdi-phone"></i>
              </span>
            </div>
            <p v-show="!phoneValid" class="help is-danger">ნომერი არასწორია</p>
          </div>

          <div class="field">
            <label class="label">მისამართი</label>
            <div class="control">
              <textarea
                v-model="address.address"
                class="textarea"
                type="text"
                rows="3"
                :class="{'is-danger': !addressValid}"
              ></textarea>
            </div>
            <p v-show="!addressValid" class="help is-danger">გთხოვთ შეიყვანოთ მისამართი</p>
          </div>

          <div class="field">
            <label class="label">ქალაქი</label>
            <div class="control">
              <div class="select">
                <select v-model="address.city">
                  <option value="თბილისი">თბილისი</option>
                </select>
              </div>
            </div>
            <p>&nbsp;</p>
          </div>
        </div>

        <div class="column is-4 order-sidebar">
          <table class="table is-fullwidth">
            <tr v-for="(item, index) in order.items" :key="index">
              <td>{{item.title}}</td>
              <td class="has-text-right">{{item.price | price}} ₾</td>
              <td class="has-text-right">{{item.quantity}} ცალი</td>
            </tr>
          </table>
          <div class="has-text-centered">
            სულ:
            <strong>{{orderTotal | price}} ₾</strong>
          </div>
          <div class="has-text-centered">
            <button class="button is-large is-success" @click="gotoPayment()">
              <span>გაგრძელება</span>
              <span class="icon">
                <i class="mdi mdi-chevron-right"></i>
              </span>
            </button>
          </div>
        </div>
      </div>
      <div v-if="step === 'payment'">
        <div class="columns">
          <div class="column">
            <table class="table is-fullwidth">
              <tr v-for="(item, index) in order.items" :key="index">
                <td>{{item.title}}</td>
                <td class="has-text-right">{{item.price | price}} ₾</td>
                <td class="has-text-right">{{item.quantity}} ცალი</td>
              </tr>
            </table>
          </div>
          <div class="column has-text-centered">
            <div>{{order.address.name}} {{order.address.surname}}</div>
            <div><i class="mdi mdi-phone"></i> {{order.address.phone}} {{order.address.city}}</div>
            <div><i class="mdi mdi-building"></i> {{order.address.address}}</div>
          </div>
        </div>

        <div class="has-text-centered">
          <div>
            სულ:
            <strong>{{orderTotal | price}} ₾</strong>
          </div>

          <button class="button is-large is-success" @click="payOrder()">
            <span>გადახდა</span>
            <span class="icon">₾</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FullCart from "../../components/FullCart";

export default {
  components: { FullCart },
  data() {
    return {
      order: {},
      address: {
        city: "თბილისი"
      },
      phoneValid: true,
      nameValid: true,
      surnameValid: true,
      addressValid: true,
      loading: false,
      step: "cart"
    };
  },
  methods: {
    gotoAddress() {
      this.order.items = this.$store.state.cart.items;
      this.step = "address";
    },
    gotoPayment() {
      if (!this.validate()) return;
      this.order.address = Object.assign({}, this.address);
      this.step = "payment";
      this.createOrder();
    },
    validate() {
      this.nameValid = this.address.name != null && this.address.name.length;
      this.surnameValid =
        this.address.surname != null && this.address.surname.length;
      this.phoneValid =
        this.address.phone != null &&
        this.address.phone.length &&
        this.address.phone.match(/^[0-9]{9,}$/i);
      this.addressValid =
        this.address.address != null && this.address.address.length;
      return (
        this.nameValid &&
        this.surnameValid &&
        this.phoneValid &&
        this.addressValid
      );
    },
    createOrder() {
      this.loading = true;
      this.$axios
        .post("/api/user/orders", this.order)
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
    },
    payOrder() {
      this.$store.commit("cart/setItems", []);
      this.loading = true;
      this.$axios
        .put("/api/user/orders/" + this.order._id + "/pay")
        .then(response => {
          this.loading = false;
          this.order = response.data;
          if (this.order.payment && this.order.payment.links) {
            let redirectLink = null;
            this.order.payment.links.forEach(link => {
              if (link.rel === "approve") redirectLink = link.href;
            });
            if (redirectLink) location.href = redirectLink;
          }
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
    cancelOrder() {
      this.loading = true;
      this.$axios
        .put("/api/user/orders/" + this.order._id + "/cancel")
        .then(response => {
          this.loading = false;
          this.$router.replace('/');
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
  },
  computed: {
    orderTotal() {
      if (!this.order || !this.order.items) return 0;
      return this.order.items.reduce((sum, item) => {
        if (!item.quantity || !item.price) return sum;
        return sum + item.quantity * item.price;
      }, 0);
    }
  }
};
</script>

<style>
</style>