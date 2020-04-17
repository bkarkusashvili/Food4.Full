<template>
  <div class="login-form has-text-centered">
    <form @submit.prevent="requestReset" v-show="!showEmailConfirmation">
      <h1 class="title">პაროლის აღდგენა</h1>
      <div class="field">
        <label class="label is-large">შეიყვანეთ თქვენი ელ-ფოსტა:</label>
        <div class="control">
          <input class="input is-large" type="email" v-model="email" autocomplete="email" />
        </div>
      </div>

      <div class="notification is-danger" v-show="error">
        <button class="delete" type="button" @click="error = false"></button>
        {{error}}
      </div>

      <div class="field">
        <div class="control">
          <button class="button is-success is-large is-fullwidth" :disabled="loading">
            <span>აღდგენა</span>
            <span class="icon" v-show="loading">
              <i class="mdi mdi-reload mdi-spin"></i>
            </span>
          </button>
        </div>
      </div>
    </form>
    <div v-show="showEmailConfirmation" class="email-confirmation has-text-centered">
      <h1 class="title">პაროლის აღსადგენი ბმული გამოგზავნილია!</h1>
      <i class="mdi mdi-email has-text-primary" style="font-size: 70px;"></i>
      <h2
        class="subtitle"
      >პაროლის შესაცვლელად მიჰყევით თქვენს მითითებულ ელ-ფოსტაზე გამოგზავნილ ბმულს.</h2>
      <nuxt-link to="/">მთავარ გვერდზე დაბრუნება</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      error: null,
      loading: false,
      email: "",
      showEmailConfirmation: false
    };
  },
  created() {},
  methods: {
    requestReset: function() {
      this.loading = true;
      this.error = false;
      this.$axios
        .post("/api/auth/forgot", { email: this.email })
        .then(() => {
          this.loading = false;
          this.showEmailConfirmation = true;
        })
        .catch(err => {
          this.loading = false;
          this.error = err.message;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style>
.login-form {
  max-width: 32em;
  margin: 0 auto;
}
</style>
