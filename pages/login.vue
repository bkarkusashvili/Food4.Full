<template>
  <div class="login-page">
    <div class="container">
      <div class="tabs is-large is-centered is-fullwidth">
        <ul>
          <li :class="{'is-active': activePage === 'register'}">
            <a href="#register" @click="activePage = 'register'">რეგისტრაცია</a>
          </li>
        </ul>
        <ul>
          <li :class="{'is-active': activePage === 'login'}">
            <a href="#login" @click="activePage = 'login'">შესვლა</a>
          </li>
        </ul>
      </div>

      <div v-show="activePage === 'register'" class="registration-form">
        <button>რეგისტრაცია</button>
      </div>
      <div v-show="activePage === 'login'" class="login-form">
        <button>შესვლა</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      activePage: "register"
    };
  },
  created() {
    if (process.client) {
      this.updateHash();
    }
  },
  methods: {
    updateHash() {
      if (location.hash === "#register") {
        this.activePage = "register";
      } else if (location.hash === "#login") {
        this.activePage = "login";
      }
      this.$forceUpdate();
    }
  }
};
</script>

<style>
</style>
