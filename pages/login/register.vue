<template>
  <div class="registration-form">
    <form @submit.prevent="register" autocomplete="off" v-show="!showEmailConfirmation">
      <div class="field">
        <label class="label is-large">სახელი</label>
        <div class="control">
          <input class="input is-large" type="name" v-model="name" required />
        </div>
      </div>
      <div class="field">
        <label class="label is-large">ელ-ფოსტა</label>
        <div class="control">
          <input class="input is-large" type="email" v-model="email" required />
        </div>
      </div>
      <div class="field">
        <label class="label is-large">პაროლი</label>
        <div class="control">
          <input class="input is-large" type="password" v-model="password" required />
        </div>
      </div>
      <div class="field">
        <label class="label is-large">პაროლი (განმეორებით)</label>
        <div class="control">
          <input class="input is-large" type="password" v-model="repeatPassword" required />
        </div>
      </div>

      <div class="notification is-danger" v-show="error">
        <button class="delete" type="button" @click="error = false"></button>
        {{error}}
      </div>

      <div class="field">
        <div class="control">
          <button class="button is-success is-large is-fullwidth">რეგისტრაცია</button>
        </div>
      </div>
    </form>
    <div v-show="showEmailConfirmation" class="email-confirmation has-text-centered">
      <h1 class="title">გილოცავთ! <br> თქვენ დარეგისტრირდით!</h1>
      <i class="mdi mdi-email has-text-primary" style="font-size: 70px;"></i>
      <h2 class="subtitle">გთხოვთ ელ-ფოსტის დასადასტურებლად მიჰყევით თქვენს მითითებულ ელ-ფოსტაზე გამოგზავნილ ბმულს.</h2>
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
      email: "",
      password: "",
      repeatPassword: "",
      name: "",
      valid: true,
      emailTaken: false,
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
      this.$axios.post("/api/users/register", {
        email: this.email,
        password: this.password,
        name: this.name
      }).then((response) => {
        this.showEmailConfirmation = true;
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
