<template>
  <div class="page-section-latest" :class="{'compact': section.compact}">
    <h1 v-if="section.title" class="title">{{section.title}}</h1>
    <div
      class="flex"
      :class="{'flex-column': section.vertical, 'flex-row': !section.vertical, 'flex-wrap': !section.vertical}"
    >
      <div class="recipe-container" v-for="post in posts" :key="post._id">
        <blog-post
          :no-picture="section.noPictures"
          :border="section.borders"
          :compact="section.compact"
          :post="post"
          v-if="post.type === 'blog'"
        />
        <news-post
          :no-picture="section.noPictures"
          :border="section.borders"
          :compact="section.compact"
          :post="post"
          v-else-if="post.type === 'news'"
        />
        <single-recipe
          :post="post"
          :no-picture="section.noPictures"
          :border="section.borders"
          :compact="section.compact"
          v-else
        />
      </div>
    </div>
  </div>
</template>

<script>
import SingleRecipe from "./SingleRecipe";
import NewsPost from "./NewsPost";
import BlogPost from "./BlogPost";

export default {
  name: "page-section-latest",
  components: { SingleRecipe, NewsPost, BlogPost },
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
      let query = {
        limit: this.section.limit,
        type: ["news", "recipe"]
      };
      if (this.section.featured != null) query.featured = this.section.featured;
      this.$axios
        .get("/api/posts/latest", {
          params: query
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
</style>