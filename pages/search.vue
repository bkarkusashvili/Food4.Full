<template>
  <div class="search-page">
    <div class="container page-container">
      <h1 class="title">
        ძიების შედეგები:
        <i>"{{$route.query.q}}"</i>
      </h1>
      <div class="flex flex-row flex-wrap">
        <div class="recipe-container" v-for="post in posts" :key="post._id">
          <single-recipe class="search-result" :post="post" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SingleRecipe from "../components/SingleRecipe";

export default {
  components: { SingleRecipe },
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
  },
  head() {
    return {
      title: "ძებნა - " + this.$store.state.settings.title
    };
  }
};
</script>

<style lang="scss">
.search-page {
  padding-top: 2em;
  padding-bottom: 2em;
}
.search-page .recipe-container {
  flex-basis: 25%;
  padding-right: 1em;
}
</style>
