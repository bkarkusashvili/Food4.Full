<template>
  <div class="order-page">
    <div class="container" style="padding: 0 15px;">
      <ul class="steps is-narrow is-horizontal is-medium is-centered has-content-centered">
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
          <div class="has-text-centered" style="margin-top: 1em">
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
          <div style="max-width: 30em; margin: 0 auto">
            <div class="is-hidden-desktop is-hidden-tablet" style="margin-bottom: 30px">
              <a
                v-for="(addr, index) in $auth.user.addresses"
                :key="index"
                class="box"
                :class="{'address-selected': selectedAddress === index }"
                @click="selectAddress(addr, index)"
              >
                <div>
                  <i class="mdi mdi-account"></i>
                  {{addr.name}} {{addr.surname}}
                </div>
                <div>
                  <i class="mdi mdi-phone"></i>
                  {{addr.phone}}
                  <i class="mdi mdi-city"></i>
                  {{addr.city}}
                </div>
                <div>
                  <i class="mdi mdi-home"></i>
                  {{addr.address}}
                </div>
              </a>
              <a
                class="box has-text-centered"
                @click="selectAddress({ city: 'თბილისი' }, null)"
                :class="{'address-selected': selectedAddress == null }"
              >
                <span class="icon">
                  <i class="mdi mdi-plus"></i>
                </span>
                <span>ახალი მისამართი</span>
              </a>
            </div>

            <div class="field">
              <label class="label">სახელი</label>
              <div class="control">
                <input
                  autocomplete="given-name"
                  v-model="address.name"
                  class="input"
                  type="text"
                  :class="{'is-danger': !nameValid}"
                />
              </div>
              <p v-show="!nameValid" class="help is-danger">გთხოვთ შეიყვანოთ სახელი</p>
            </div>

            <div class="field">
              <label class="label">გვარი</label>
              <div class="control">
                <input
                  autocomplete="family-name"
                  v-model="address.surname"
                  class="input"
                  type="text"
                  :class="{'is-danger': !surnameValid}"
                />
              </div>
              <p v-show="!surnameValid" class="help is-danger">გთხოვთ შეიყვანოთ გვარი</p>
            </div>

            <div class="field">
              <label class="label">ტელეფონი</label>
              <div class="control has-icons-left">
                <input
                  autocomplete="tel-national"
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
                  autocomplete="street-address"
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
              <div class="control has-icons-left">
                <div class="select">
                  <select v-model="address.city">
                    <option value="თბილისი">თბილისი</option>
                  </select>
                </div>
                <div class="icon is-small is-left">
                  <i class="mdi mdi-city"></i>
                </div>
              </div>
              <p>&nbsp;</p>
            </div>
          </div>
        </div>

        <div class="column is-4 order-sidebar">
          <div class="is-hidden-mobile" style="margin-bottom: 20px">
            <a
              v-for="(addr, index) in $auth.user.addresses"
              :key="index"
              class="box"
              :class="{'address-selected': selectedAddress === index }"
              @click="selectAddress(addr, index)"
            >
              <div>
                <i class="mdi mdi-account"></i>
                {{addr.name}} {{addr.surname}}
              </div>
              <div>
                <i class="mdi mdi-phone"></i>
                {{addr.phone}}
                <i class="mdi mdi-city"></i>
                {{addr.city}}
              </div>
              <div>
                <i class="mdi mdi-home"></i>
                {{addr.address}}
              </div>
            </a>
            <a
              class="box has-text-centered"
              @click="selectAddress({ city: 'თბილისი' }, null)"
              :class="{'address-selected': selectedAddress == null }"
            >
              <span class="icon">
                <i class="mdi mdi-plus"></i>
              </span>
              <span>ახალი მისამართი</span>
            </a>
          </div>

          <table class="table is-fullwidth">
            <tr v-for="(item, index) in order.items" :key="index">
              <td>{{item.title}}</td>
              <td class="has-text-right">{{item.price | price}} ₾</td>
              <td class="has-text-right">{{item.quantity}} ცალი</td>
            </tr>
            <tr>
              <th>სულ</th>
              <th class="has-text-right">{{orderTotal | price}} ₾</th>
              <th class="has-text-right">{{itemCount}} ცალი</th>
            </tr>
          </table>

          <div class="has-text-centered" style="margin-top: 1em">
            <button class="button is-large is-success" @click="gotoPayment()" :disabled="loading">
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
            <div class="box">
              <a class="subtitle" @click="step = 'cart'" title="ჩამონათვალის ცვლილება">
                <span class="icon">
                  <i class="mdi mdi-pencil"></i>
                </span>
                <span>ჩამონათვალი</span>
              </a>
              <table class="table is-fullwidth">
                <tr v-for="(item, index) in order.items" :key="index">
                  <td>{{item.title}}</td>
                  <td class="has-text-right">{{item.price | price}} ₾</td>
                  <td class="has-text-right">{{item.quantity}} ცალი</td>
                </tr>
                <tr>
                  <th>სულ</th>
                  <th class="has-text-right">{{orderTotal | price}} ₾</th>
                  <th class="has-text-right">{{itemCount}} ცალი</th>
                </tr>
              </table>
            </div>
          </div>
          <div class="column">
            <div class="box">
              <a class="subtitle" @click="step = 'address'" title="მისამართის ცვლილება">
                <span class="icon">
                  <i class="mdi mdi-pencil"></i>
                </span>
                <span>მისამართი</span>
              </a>
              <div>{{order.address.name}} {{order.address.surname}}</div>
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

        <div class="has-text-centered" style="margin-top: 1em; padding-bottom: 1em">
          <button
            class="button is-danger is-large"
            @click="cancelOrder()"
            :disabled="loading"
          >გაუქმება</button>
          <button class="button is-large is-success" @click="payOrder()" :disabled="loading">გადახდა</button>
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
      selectedAddress: null,
      phoneValid: true,
      nameValid: true,
      surnameValid: true,
      addressValid: true,
      loading: false,
      step: "cart"
    };
  },
  mounted() {
    if (!this.$auth.user)
      this.$router.replace("/login?return=" + this.$route.path);
  },
  methods: {
    gotoAddress() {
      this.order.items = this.$store.state.cart.items;
      if (
        this.order.address == null &&
        this.$auth.user.defaultAddress != null &&
        this.$auth.user.addresses
      ) {
        let address = this.$auth.user.addresses[this.$auth.user.defaultAddress];
        if (address) {
          this.selectAddress(address, this.$auth.user.defaultAddress);
        }
      }
      this.step = "address";
    },
    selectAddress(address, index) {
      if (this.selectedAddress === index) return;
      this.selectedAddress = index;
      this.address = this.cloneAddress(address);
    },
    cloneAddress(address) {
      return {
        name: address.name,
        surname: address.surname,
        phone: address.phone,
        city: address.city,
        address: address.address
      };
    },
    saveAddress() {
      let addresses = this.$auth.user.addresses.map(address =>
        this.cloneAddress(address)
      );

      if (this.selectedAddress != null)
        addresses[this.selectedAddress] = this.address;
      else {
        addresses.push(this.address);
      }

      let data = {
        addresses: addresses
      };

      if (this.$auth.user.defaultAddress == null)
        data.defaultAddress =
          this.selectedAddress == null
            ? data.addresses.length - 1
            : this.selectedAddress;

      this.$axios
        .put("/api/user/users/me", data)
        .then(response => {
          console.log("Address saved");
        })
        .catch(error => {
          console.error("Error saving address", error);
        });
    },
    gotoPayment() {
      if (!this.validate()) return;
      this.order.address = Object.assign({}, this.address);
      this.saveAddress();
      if (this.order._id == null) {
        this.createOrder().then(() => {
          this.step = "payment";
        });
      } else {
        this.updateOrder().then(() => {
          this.step = "payment";
        });
      }
    },
    validate() {
      this.nameValid = this.address.name != null && this.address.name.length;
      this.surnameValid =
        this.address.surname != null && this.address.surname.length;
      this.phoneValid =
        this.address.phone != null &&
        this.address.phone.length &&
        this.address.phone.match(/^[0-9\- ]{9,}$/i);
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
      return this.$axios
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
          throw err;
        });
    },
    updateOrder() {
      this.loading = true;
      return this.$axios
        .put("/api/user/orders/" + this.order._id, this.order)
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
          throw err;
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
          this.$router.replace("/");
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
    },
    itemCount() {
      if (!this.order || !this.order.items) return 0;
      return this.order.items.reduce((sum, item) => {
        if (!item.quantity) return sum;
        return sum + item.quantity;
      }, 0);
    }
  }
};
</script>

<style>
.order-page {
  padding-bottom: 2em;
}

.order-page .address-selected {
  background-color: #9292f3;
  color: white;
}
</style>