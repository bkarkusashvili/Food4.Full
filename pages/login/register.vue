<template>
  <div class="registration-form">
    <form @submit.prevent="register" autocomplete="off" v-show="!showEmailConfirmation">
      <div class="field">
        <label class="label is-medium">სახელი</label>
        <div class="control">
          <input class="input is-medium" type="name" autocomplete="name" v-model="name" required />
        </div>
      </div>
      <div class="field">
        <label class="label is-medium">ელ-ფოსტა</label>
        <div class="control">
          <input class="input is-medium" autocomplete="email" type="email" v-model="email" required />
        </div>
      </div>
      <div class="field">
        <label class="label is-medium">პაროლი</label>
        <div class="control">
          <input
            class="input is-medium"
            type="password"
            autocomplete="new-password"
            v-model="password"
            required
          />
        </div>
      </div>
      <div class="field">
        <label class="label is-medium">პაროლი (განმეორებით)</label>
        <div class="control">
          <input
            class="input is-medium"
            type="password"
            autocomplete="new-password"
            v-model="repeatPassword"
            required
          />
        </div>
      </div>

      <div class="notification is-danger" v-show="error">
        <button class="delete" type="button" @click="error = false"></button>
        {{error}}
      </div>

      <div class="field">
        <div class="control">
          <button class="button is-success is-medium is-fullwidth" :disabled="loading">
            <span>რეგისტრაცია</span>
            <span class="icon" v-show="loading">
              <i class="mdi mdi-reload mdi-spin"></i>
            </span>
          </button>
        </div>
      </div>
    </form>
    <div v-show="showEmailConfirmation" class="email-confirmation has-text-centered">
      <h1 class="title">
        გილოცავთ!
        <br />თქვენ დარეგისტრირდით!
      </h1>
      <i class="mdi mdi-email has-text-primary" style="font-size: 70px;"></i>
      <h2
        class="subtitle"
      >გთხოვთ ელ-ფოსტის დასადასტურებლად მიჰყევით თქვენს მითითებულ ელ-ფოსტაზე გამოგზავნილ ბმულს.</h2>
      <nuxt-link to="/">მთავარ გვერდზე დაბრუნება</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      loading: false,
      error: null,
      email: "",
      password: "",
      repeatPassword: "",
      name: "",
      valid: true,
      showEmailConfirmation: false
    };
  },
  created() {},
  methods: {
    validate() {
      return true;
    },
    register() {
      if (!this.validate()) return;
      this.loading = true;
      this.$axios
        .post("/api/users/register", {
          email: this.email,
          password: this.password,
          name: this.name
        })
        .then(response => {
          this.loading = false;
          this.showEmailConfirmation = true;
          localStorage.setItem('redirectAfterConfirm', this.$route.query.return);
        })
        .catch(err => {
          if(err.response && err.response.data && err.response.data.taken) {
            this.error = "მომხმარებელი ასეთი ელ-ფოსტით უკვე რეგისტრირებულია!"
          } else {
            this.error = (err.response && err.response.data && err.response.data.message) || err.message;
          }
          this.loading = false;
        });
    }
  }
};
</script>

<style>
.registration-form {
  max-width: 32em;
  margin: 0 auto;
}
</style>
