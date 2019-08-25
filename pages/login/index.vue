<template>
  <div class="login-form">
    <form @submit.prevent="login">
      <div class="field">
        <label class="label is-large">ელ-ფოსტა</label>
        <div class="control">
          <input class="input is-large" type="email" v-model="email" />
        </div>
      </div>
      <div class="field">
        <label class="label is-large">პაროლი</label>
        <div class="control">
          <input class="input is-large" type="password" v-model="password" />
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <label class="checkbox is-large">
            <input type="checkbox" v-model="remember" />
            დამიმახსოვრე
          </label>
        </div>
        <div class="control" style="flex-grow: 1"></div>
        <div class="control">
          <nuxt-link to="/login/forgot">პაროლის აღდგენა</nuxt-link>
        </div>
      </div>

      <div class="notification is-danger" v-show="error && error !== 'not_confirmed'">
        <button class="delete" type="button" @click="error = false"></button>
        {{error}}
      </div>
      <div class="notification" v-show="error">
        <button class="delete" type="button" @click="error = false"></button>
        შესაძლოა თქვენი ელ-ფოსტა დადასტურებული არ არის, შეგიძლიათ <nuxt-link to="/login/newcode">დადასტურების ახლიდან მოთხოვნა</nuxt-link>
      </div>

      <div class="field">
        <div class="control">
          <button class="button is-success is-large is-fullwidth" :disabled="loading">
            <span>შესვლა</span>
            <span class="icon" v-show="loading">
              <i class="mdi-refresh mdi-spin"></i>
            </span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      loading: false,
      error: null,
      remember: false,
      email: "",
      password: ""
    };
  },
  created() {},
  methods: {
    login: function() {
      this.loading = true;
      this.$auth
        .loginWith("local", {
          data: {
            email: this.email,
            password: this.password,
            remember: this.remember
          }
        })
        .then(result => {
          this.loading = false;
          this.$router.replace("/");
        })
        .catch(error => {
          this.loading = false;
          this.error = "არასწორი ელ-ფოსტა ან პაროლი!";
          console.error(error);
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
