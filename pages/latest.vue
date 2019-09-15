<template>
  <div class="latest-page">
    <div class="container page-container">
      <h1 class="title">ბოლოს დამატებული</h1>
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
      total: 1,
      page: 1,
      perPage: 12
    };
  },
  created() {},
  methods: {
    fetchData() {
      this.$axios
        .get("/api/posts/latest", { params: {} })
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
      this.fetchData();
    },
    queryParams() {
      return {
        offset: (this.page - 1) * this.perPage,
        limit: this.perPage
      };
    }
  },
  watch: {
    $route: "search"
  },
  asyncData({ $axios, error }) {
    return $axios
      .get("/api/posts/latest")
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
      title: "ახალი რეცეპტები - " + this.$store.state.settings.title
    };
  }
};
</script>

<style lang="scss">
.latest-page {
  padding-top: 2em;
  padding-bottom: 2em;
}
</style>
