<template>
  <div class="page-section-tags">
    <div class="tags are-medium is-centered" v-show="!all">
      <a
        class="tag"
        v-for="tag in tags"
        :key="tag._id"
        :class="{ 'is-primary': selectedTag === tag }"
        @click="selectTag(tag)"
      >{{tag.title}}</a>
    </div>

    <div class="columns">
      <div class="column is-4" v-for="post in filteredPosts" :key="post._id">
        <single-recipe :post="post" />
      </div>
    </div>
  </div>
</template>

<script>
import SingleRecipe from "./SingleRecipe";

export default {
  name: "page-section-tags",
  components: { SingleRecipe },
  props: {
    section: Object,
    all: Boolean
  },
  data() {
    return {
      tags: [],
      selectedTag: null,
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
      if(this.section.tags) {
        params._id = this.section.tags
      }

      this.$axios
        .get("/api/tagsAndPosts", { params: params })
        .then(response => {
          this.tags = response.data.tags;
          this.posts = response.data.posts;
          if (this.tags.length) this.selectedTag = this.tags[0];
        })
        .catch(err => console.error(err));
    }
  },
  computed: {
    filteredPosts() {
      if (!this.posts || !this.selectedTag) return [];
      return this.posts.filter(post => {
        return (
          post.tags && post.tags.find(tag => tag._id === this.selectedTag._id)
        );
      });
    }
  }
};
</script>

<style>
</style>