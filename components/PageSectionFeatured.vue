<template>
  <div class="page-section-featured" v-show="posts.length" :class="{'compact': section.compact}">
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
  name: "page-section-featured",
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
      let params = {
        featured: true
      };
      if (this.section.onlyOne) {
        params.limit = 1;
      }
      if (this.section.limit) {
        params.limit = this.section.limit;
      }
      this.$axios
        .get("/api/posts/latest", {
          params: params
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
.page-section-featured .title {
  padding-left: 5px;
}
.page-section-featured.compact .title {
  font-size: 24px;
  margin-bottom: 10px;
}
.page-section-featured .flex-row .recipe-container {
  flex-basis: 20em;
  padding-right: 1em;
}
</style>