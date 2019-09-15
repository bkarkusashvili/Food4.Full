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
      <pagination :page="page" :total="total" :per-page="perPage" @goto="gotoPage" />
    </div>
  </div>
</template>

<script>
import SingleRecipe from "../components/SingleRecipe";

export default {
  components: { SingleRecipe },
  data() {
    return {
      posts: [],
      page: 1,
      total: 1,
      perPage: 12
    };
  },
  created() {},
  methods: {
    search: function() {
      if (!this.$route.query.q) return;
      this.$axios
        .get("/api/posts", { params: this.queryParams() })
        .then(response => {
          this.posts = response.data;
          let total = response.headers["x-total-count"];
          if (!isNaN(total)) this.total = parseInt(total);
        })
        .catch(err => {
          console.error(err);
        });
    },
    gotoPage(page) {
      this.page = parseInt(page);
      this.search();
    },
    queryParams() {
      return {
        q: this.$route.query.q,
        offset: (this.page - 1) * this.perPage,
        limit: this.perPage
      };
    }
  },
  watch: {
    $route: "search"
  },
  asyncData({ $axios, query, error }) {
    if (!query.q) return;
    return $axios
      .get("/api/posts", { params: { q: query.q, perPage: 12 } })
      .then(response => {
        let data = { posts: response.data };
        let total = response.headers["x-total-count"];
        if (!isNaN(total)) data.total = parseInt(total);
        return data;
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
