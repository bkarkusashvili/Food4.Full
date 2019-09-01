<template>
  <div class="page-section-featured">
    <h1 v-if="section.title" class="title">{{section.title}}</h1>
    <div class="columns">
      <div class="column">
        <single-recipe :post="posts[0]" v-if="posts.length" />
      </div>
      <div class="column" v-if="posts.length > 1">
        <a class="" v-for="(post, index) in posts" v-if="index > 1" :key="post._id">
          <span class="title">{{post.title}}</span>
          <span class="subtitle">{{post.subtitle}}</span>
        </a>
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
        .get("/api/posts/latest?featured=true")
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