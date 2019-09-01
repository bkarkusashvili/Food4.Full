<template>
  <div class="page-section-latest">
    <h1 v-if="section.title" class="title">{{section.title}}</h1>
    <div class="flex" :class="{'flex-column': section.vertical, 'flex-row': !section.vertical}">
      <div class="" v-for="post in posts" :key="post._id">
        <single-recipe :post="post" :no-picture="section.noPictures" :border="section.vertical" />
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
      this.$axios
        .get("/api/posts/latest")
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