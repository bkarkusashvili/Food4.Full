<template>
  <div class="favorites-page">
    <div class="container page-container">
      <h1 class="title">ფავორიტები</h1>
      <div class="flex flex-row flex-wrap">
        <div class="recipe-container" v-for="favorite in favorites" :key="favorite._id">
          <single-recipe class="search-result" :post="favorite.post" />
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
      tag: {}
    };
  },
  created() {},
  methods: {},
  watch: {},
  asyncData({ $axios, params, error }) {
    return $axios
      .get("/api/user/favorites")
      .then(response => {
        return { favorites: response.data };
      })
      .catch(err => {
        console.error(err);
        error({ statusCode: 500 });
      });
  },
  head() {
    if (this.tag)
      return {
        title: "ფავორიტები" + " - " + this.$store.state.settings.title
      };
  }
};
</script>

<style lang="scss">
.favorites-page {
  padding-top: 2em;
  padding-bottom: 2em;
}

.favorites-page .recipe-container {
  flex-basis: 25%;
  padding-right: 1em;
}
</style>
