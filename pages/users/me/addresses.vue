<template>
  <div class="user-addresses">
    <div v-if="!editingAddress">
      <div
        v-for="(address, index) in addresses"
        :key="index"
        class="address-box box flex flex-row flex-align-items-center"
      >
        <div>
          <button
            class="button is-rounded has-text-success is-white"
            @click="setDefault(index)"
            title="მთავარ მისამართად არჩევა"
          >
            <span class="icon">
              <i
                class="mdi"
                :class="{'mdi-star-outline': defaultAddress !== index, 'mdi-star': defaultAddress === index}"
              ></i>
            </span>
          </button>
          <button
            class="button is-rounded is-white"
            @click="editAddress(address)"
            title="რედაქტირება"
          >
            <span class="icon">
              <i class="mdi mdi-pencil"></i>
            </span>
          </button>
          <button
            class="button is-rounded is-white has-text-danger"
            @click="removeAddress(index)"
            title="წაშლა"
          >
            <span class="icon">
              <i class="mdi mdi-delete"></i>
            </span>
          </button>
        </div>
        <div class="flex-grow-1" style="padding-left: 2em">
          <div>
            <i class="mdi mdi-account"></i>
            {{address.name}} {{address.surname}}
          </div>
          <div>
            <i class="mdi mdi-phone"></i>
            {{address.phone}}
            <i class="mdi mdi-city"></i>
            {{address.city}}
          </div>
          <div>
            <i class="mdi mdi-home"></i>
            {{address.address}}
          </div>
        </div>
      </div>

      <button
        type="button"
        class="button is-large is-success flex-justify-content-center is-fullwidth"
        @click="addAddress()"
      >
        <span class="icon">
          <i class="mdi mdi-plus"></i>
        </span>
        <span>მისამართის დამატება</span>
      </button>
    </div>
    <div class="user-address-edit" v-if="editingAddress">
      <form @submit.prevent="save()" @reset.prevent="reset()" class="form">
        <div class="field">
          <label class="label">სახელი</label>
          <div class="control">
            <input
              autocomplete="given-name"
              v-model="editingAddress.name"
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
              v-model="editingAddress.surname"
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
              v-model="editingAddress.phone"
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
              v-model="editingAddress.address"
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
              <select v-model="editingAddress.city">
                <option value="თბილისი">თბილისი</option>
              </select>
            </div>
            <div class="icon is-small is-left">
              <i class="mdi mdi-city"></i>
            </div>
          </div>
        </div>

        <div class="field is-grouped is-grouped-centered">
          <div class="control">
            <button class="button is-medium" type="reset">გასუფთავება</button>
          </div>
          <div class="control">
            <button class="button is-medium is-success" type="submit" :disabled="loading">შენახვა</button>
          </div>
        </div>
        <div class="has-text-centered notification is-danger" v-if="error">
          <h1 class="title">მოხდა შეცდომა!</h1>
          <p>{{error}}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addresses: [],
      defaultAddress: null,
      editingAddress: null,
      new: true,
      error: null,
      loading: false,
      nameValid: true,
      surnameValid: true,
      phoneValid: true,
      addressValid: true
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    addAddress() {
      this.editingAddress = {
        city: "თბილისი"
      };
      this.new = true;
    },
    editAddress(address) {
      this.editingAddress = address;
      this.new = false;
    },
    fetchData() {
      this.$axios
        .get("/api/auth/me")
        .then(response => {
          this.addresses = response.data.addresses || [];
          this.defaultAddress = response.data.defaultAddress;
        })
        .catch(error => {
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
    },
    setDefault(index) {
      let data = {
        defaultAddress: index
      };
      this.$axios
        .put("/api/user/users/me", data)
        .then(response => {
          this.fetchData();
        })
        .catch(error => {
          this.loading = false;
          this.error = error.message;
        });
    },
    removeAddress(index) {
      this.addresses.splice(index, 1);
      let data = {
        addresses: this.addresses
      };
      if (
        this.defaultAddress != null &&
        this.defaultAddress >= this.addresses.length
      )
        data.defaultAddress = this.addresses.length - 1;

      this.$axios
        .put("/api/user/users/me", data)
        .then(response => {
          this.fetchData();
        })
        .catch(error => {
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
    },
    save() {
      if (!this.validate()) return;

      if (this.new) {
        this.addresses.push(this.editingAddress);
      }

      let data = {
        addresses: this.addresses
      };

      if (this.defaultAddress == null)
        data.defaultAddress = data.addresses.length - 1;

      this.loading = true;
      this.error = null;
      this.$axios
        .put("/api/user/users/me", data)
        .then(response => {
          this.loading = false;
          this.error = null;
          this.editingAddress = null;
          this.fetchData();
        })
        .catch(error => {
          this.loading = false;
          this.error = error.message;
        });
    },
    reset() {
      this.error = null;
    },
    validate() {
      this.nameValid =
        this.editingAddress.name != null && this.editingAddress.name.length;
      this.surnameValid =
        this.editingAddress.surname != null &&
        this.editingAddress.surname.length;
      this.phoneValid =
        this.editingAddress.phone != null &&
        this.editingAddress.phone.length &&
        this.editingAddress.phone.match(/^[0-9\- ]{9,}$/i);
      this.addressValid =
        this.editingAddress.address != null &&
        this.editingAddress.address.length;
      return (
        this.nameValid &&
        this.surnameValid &&
        this.phoneValid &&
        this.addressValid
      );
    }
  }
};
</script>

<style>
.user-addresses {
  padding: 10px;
}
</style>