<template>
  <div class="page-section-tags" :class="section.class">
    <div class="tags are-medium is-centered" v-show="!section.all">
      <a
        class="tag"
        v-for="tag in tags"
        :key="tag._id"
        :class="{ 'is-primary': selectedTag === tag }"
        @click="selectTag(tag)"
      >{{tag.title}}</a>
    </div>

    <div
      class="flex"
      :class="{'flex-column': section.vertical, 'flex-row': !section.vertical, 'flex-wrap': !section.vertical}"
    >
      <div class="recipe-container" v-for="post in filteredPosts" :key="post._id">
        <single-recipe
          :post="post"
          :no-picture="section.noPictures"
          :border="section.borders"
          :compact="section.compact"
          v-if="post.type === 'recipe'"
        />
        <blog-post
          :post="post"
          v-if="post.type === 'blog'"
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
import BlogPost from "./BlogPost";

export default {
  name: "page-section-tags",
  components: { SingleRecipe, BlogPost },
  props: {
    section: { type: Object, required: true },
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
      if (this.section.tags) {
        params._id = this.section.tags;
      } else {
        params.featured = true;
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
.page-section-tags.compact .title {
  font-size: 24px;
  margin-bottom: 10px;
}
</style>