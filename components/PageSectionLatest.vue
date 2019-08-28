<template>
  <div class="page-section-latest">
    <h1 v-if="section.title" class="title has-text-centered">{{section.title}}</h1>
    <div class="columns">
      <div class="column is-4" v-for="post in posts" :key="post._id">
        <single-recipe :post="post" />
      </div>
    </div>
  </div>
</template>

<script>
import SingleRecipe from "./SingleRecipe";

export default {
  name: "page-section-latest",
  components: { SingleRecipe },
  props: {
    section: Object
  },
  data() {
    return {
      posts: []
    };
  },
  mounted() {
    this.fetchTags();
  },
  methods: {
    selectTag(tag) {
      this.selectedTag = tag;
    },
    fetchTags() {
      let params = {};
      if (this.section.featured) this.section.featured = true;
      this.$axios
        .get("/api/posts/latest", { params: params })
        .then(response => {
          this.posts = response.data;
        })
        .catch(err => console.error(err));
    }
  },
  computed: {}
};
</script>

<style>
</style>