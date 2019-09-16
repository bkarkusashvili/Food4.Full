<template>
  <div class="login-page">
    <div class="container page-container">
      <div class="tabs is-medium is-centered is-primary is-toggle">
        <ul>
          <nuxt-link tag="li" to="/login" active-class="is-active" exact>
            <a>შესვლა</a>
          </nuxt-link>
          <nuxt-link tag="li" to="/login/register" active-class="is-active" exact>
            <a>რეგისტრაცია</a>
          </nuxt-link>
        </ul>
      </div>

      <nuxt-child />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
    };
  },
  created() {
  },
  head() {
      return {
        title: "შესვლა / რეგისტრაცია" + " - " + this.$store.state.settings.title,
        meta: [
          {
            hid: "og:title",
            name: "og:title",
            property: "og:title",
            content: "შესვლა / რეგისტრაცია" + " - " + this.$store.state.settings.title
          }
        ]
      };
  },
  methods: {
  }
};
</script>

<style>
.login-page {
  padding: 1.5em;
}

.login-form, .registration-form {
  padding: 0 2em 2em 2em;
}
</style>
