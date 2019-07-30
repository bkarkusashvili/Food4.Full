<template>
  <div class="search-page">
    <div class="container page-container">
      <h1 class="title">
        ძიების შედეგები:
        <i>"{{$route.query.q}}"</i>
      </h1>
      <div class="search-result columns" v-for="post in posts" :key="post._id">
        <div class="result-image column is-one-quarter">
          <nuxt-link :to="'/recipes/' + post.slug">
            <img :src="post.picture">
          </nuxt-link>
        </div>
        <div class="result-description column">
          <h1 class="title">
            <nuxt-link :to="'/recipes/' + post.slug">{{post.title}}</nuxt-link>
          </h1>
          <h2 class="subtitle">{{post.subtitle}}</h2>
          <div v-html="post.excerpt"></div>

          <nuxt-link :to="'/recipes/' + post.slug" class="button is-rounded is-primary is-large">სრულად წაკითხვა</nuxt-link>

          <div class="">
            <strong>ტეგები:</strong>

            <a v-for="tag in post.tags" class="tag is-medium" :key="tag._id">{{tag.title}}</a>
          </div>
        </div>
      </div>
    </div>
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
  methods: {
    search: function() {
      if (!this.$route.query.q) return;
      this.$axios
        .get("/api/posts", { params: { q: this.$route.query.q } })
        .then(response => {
          this.posts = response.data;
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  watch: {
    $route: "search"
  },
  asyncData({ $axios, query, error }) {
    if (!query.q) return;
    return $axios
      .get("/api/posts", { params: { q: query.q } })
      .then(response => {
        return { posts: response.data };
      })
      .catch(err => {
        console.error(err);
        error({ statusCode: 500 });
      });
  }
};
</script>

<style lang="scss">
.search-page {
  padding-top: 2em;
}
</style>
