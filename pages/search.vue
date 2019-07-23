<template>
  <div class="search-page">
    <div class="container page-container">{{posts}}</div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      posts: []
    };
  },
  created() {},
  methods: {},
  asyncData({ $axios, query, error }) {
    if (!query.q) return;
    return $axios
      .get("/api/posts", { params: { q: query.q } })
      .then(response => {
        return { posts: response.data };
      })
      .catch(err => { console.error(err); error({ statusCode: 500 })});
  }
};
</script>

<style>
.login-form,
.registration-form {
  padding: 0 2em 2em 2em;
}
</style>
