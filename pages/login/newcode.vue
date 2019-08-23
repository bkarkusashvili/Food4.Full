<template>
  <div class="login-form has-text-centered">
    <form @submit.prevent="requestCode" v-show="!showEmailConfirmation">
      <h1 class="title">ელ-ფოსტის დადასტურების მოთხოვნა</h1>

      <div class="field">
        <label class="label is-large">ელ-ფოსტა</label>
        <div class="control">
          <input class="input is-large" type="email" v-model="email" />
        </div>
      </div>

      <div class="notification is-danger" v-show="error">
        <button class="delete" type="button" @click="error = false"></button>
        {{error}}
      </div>

      <div class="field">
        <div class="control">
          <button class="button is-success is-large is-fullwidth">მოთხოვნა</button>
        </div>
      </div>
    </form>
    <div v-show="showEmailConfirmation" class="email-confirmation has-text-centered">
      <h1 class="title">დასადასტურებელი ბმული გამოგზავნილია!</h1>
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
      error: null,
      email: "",
      showEmailConfirmation: false
    };
  },
  created() {},
  methods: {
    requestCode: function() {
      this.showEmailConfirmation = true;
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
