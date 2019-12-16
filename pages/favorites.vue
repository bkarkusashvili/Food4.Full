<template>
  <div class="favorites-page">
    <div class="container page-container">
      <h1 class="title">ფავორიტები</h1>
      <div class="flex flex-row flex-wrap">
        <div class="recipe-container" v-for="favorite in favorites" :key="favorite._id">
          <single-recipe class="search-result" :post="favorite.post" />
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
      favorites: [],
      page: 1,
      total: 1,
      perPage: 12
    };
  },
  created() {},
  methods: {
    fetchData() {
      this.$axios
        .get("/api/posts", { params: this.queryParams() })
        .then(response => {
          this.posts = response.data;
          let total = response.headers["x-total-count"];
          if (!isNaN(total)) this.total = parseInt(total);
        })
        .catch(err => {
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
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
  watch: {},
  asyncData({ $axios, params, error }) {
    return $axios
      .get("/api/user/favorites")
      .then(response => {
        let data = { favorites: response.data };
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
      title: "ფავორიტები" + " - " + this.$store.state.settings.title
    };
  }
};
</script>

<style lang="scss">
.favorites-page {
  padding: 1.5em;
}
</style>
