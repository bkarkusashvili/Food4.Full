<template>
  <div class="page-section-latest" v-show="posts.length" :class="{'compact': section.compact}">
    <h1 v-if="section.title" class="title">{{section.title}}</h1>
    <div
      class="flex"
      :class="{'flex-column': section.vertical, 'flex-row': !section.vertical, 'flex-wrap': !section.vertical}"
    >
      <div class="recipe-container" v-for="post in posts" :key="post._id">
        <single-recipe
          :post="post"
          :no-picture="section.noPictures"
          :border="section.borders"
          :compact="section.compact"
        />
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
    section: { type: Object, required: true }
  },
  data() {
    return {
      posts: []
    };
  },
  mounted() {
    this.fetchPosts();
  },
  methods: {
    fetchPosts() {
      let query = {};
      if (this.section.featured != null) query.featured = this.section.featured;
      this.$axios
        .get("/api/posts/latest", query, {
          params: {
            limit: this.section.limit
          }
        })
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
.page-section-latest .title {
  padding-left: 5px;
}
.page-section-latest.compact .title {
  font-size: 24px;
  margin-bottom: 10px;
}
.page-section-latest .flex-row .recipe-container {
  flex-basis: 20em;
  padding-right: 1em;
}
</style>