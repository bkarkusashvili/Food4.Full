<template>
  <div class="tag-page">
    <div class="container page-container">
      <h1 class="title">{{tag.title}}</h1>
      <div class="flex flex-row flex-wrap">
        <div class="recipe-container" v-for="post in tag.posts" :key="post._id">
          <single-recipe class="search-result" :post="post" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SingleRecipe from "../../components/SingleRecipe";

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
    if (!params.id) return;
    return $axios
      .get("/api/tags/" + params.id)
      .then(response => {
        return { tag: response.data };
      })
      .catch(err => {
        console.error(err);
        error({ statusCode: 500 });
      });
  },
  head() {
    if (this.tag)
      return {
        title: this.tag.title + " - " + this.$store.state.settings.title
      };
  }
};
</script>

<style lang="scss">
.tag-page {
  padding-top: 2em;
  padding-bottom: 2em;
}
</style>
