<template>
  <div class="login-page">
    <div class="container page-container">
      <div class="tabs is-large is-centered is-primary is-toggle">
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
  methods: {
  }
};
</script>

<style>
.login-page {
  padding-top: 2em;
}

.login-form, .registration-form {
  padding: 0 2em 2em 2em;
}
</style>
