<template>
  <div class="tile" :class="computeClass(tile)">
    <tile v-for="(child, index) in tile.tiles" :key="index" :tile="child" v-if="tile.tiles" />
    <div v-html="tile.content" v-if="tile.content" />

    <nuxt-link
      v-if="post"
      :to="'/recipes/' + post.slug"
      class="promo-box hero"
      :style="'background-image: url('+ post.picture +')'"
    >
      <div class="promo-box-content hero-body">
        <h1 class="title">{{post.title}}</h1>
        <h2 class="subtitle">{{post.subtitle}}</h2>
      </div>
    </nuxt-link>

    <div class="youtube-embed" v-if="tile.video">
      <iframe
        :src="tile.video | youtubeEmbed"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.component("tile", {
  name: "tile",
  props: {
    tile: Object
  },
  data() {
    return {
      post: null
    };
  },
  mounted() {
    if (this.tile.post) this.fetchPost();
  },
  methods: {
    fetchPost() {
      if (this.tile.post.slug)
        this.$axios
          .get("/api/posts/" + this.tile.slug)
          .then(response => {
            this.post = response.data;
          })
          .catch(error => {
            console.error(error);
          });
      if (this.tile.post.featured)
        this.$axios
          .get("/api/posts", { params: this.tile.post })
          .then(response => {
            this.post = response.data[0];
          })
          .catch(error => {
            console.error(error);
          });
      if (this.tile.post.latest)
        this.$axios
          .get("/api/posts/featured", { params: this.tile.post })
          .then(response => {
            this.post = response.data[0];
          })
          .catch(error => {
            console.error(error);
          });
    },
    computeClass(tile) {
      let classList = [];
      if (!tile) return classList;
      if (tile.ancestor) classList.push("is-ancestor");
      else if (tile.parent) classList.push("is-parent");
      else classList.push("is-child");
      if (tile.vertical) classList.push("is-vertical");
      if (tile.size != null) classList.push("is-" + tile.size);
      return classList;
    }
  }
});
</script>

<style>
</style>