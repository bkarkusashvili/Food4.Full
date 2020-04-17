<template>
  <div class="login-form has-text-centered">
    <form @submit.prevent="resetPassword" v-show="!success">
      <h1 class="title">პაროლის აღდგენა</h1>
      <div class="field">
        <label class="label">ახალი პაროლი:</label>
        <div class="control">
          <input
            class="input"
            type="password"
            autocomplete="new-password"
            v-model="password"
            required
          />
        </div>
      </div>
      <div class="field">
        <label class="label">ახალი პაროლი (თავიდან):</label>
        <div class="control">
          <input
            class="input"
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
            <span>პაროლის შეცვლა</span>
            <span class="icon" v-show="loading">
              <i class="mdi mdi-reload mdi-spin"></i>
            </span>
          </button>
        </div>
      </div>
    </form>
    <div v-show="success" class="email-confirmation has-text-centered">
      <h1 class="title">პაროლი შეცვლილია!</h1>
      <i class="mdi mdi-email has-text-primary" style="font-size: 70px;"></i>
      <h2
        class="subtitle"
      >შეგიძლიათ შეხვიდეთ სისტემაში თქვენი ახალი პაროლით.</h2>
      <nuxt-link to="/login">შესვლის გვერდზე დაბრუნება</nuxt-link>
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
      password: "",
      repeatPassword: "",
      success: false
    };
  },
  created() {},
  methods: {
    resetPassword: function() {
      this.loading = true;
      this.error = false;
      this.$axios
        .post("/api/auth/reset", { code: this.$route.query.code, password: this.password })
        .then(() => {
          this.success = true;
          this.loading = false;
          setTimeout(() => {
            this.$router.replace("/login");
          }, 5000);
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
