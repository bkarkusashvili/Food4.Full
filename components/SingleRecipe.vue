<template>
  <div class="single-recipe card">
    <div class="recipe-image card-image">
      <nuxt-link :to="'/recipes/' + post.slug">
        <img :src="post.picture" />
      </nuxt-link>
    </div>
    <div class="recipe-description card-content">
      <h1 class="recipe-title">
        <nuxt-link :to="'/recipes/' + post.slug">{{post.title}}</nuxt-link>
      </h1>
      <h2 class="recipe-subtitle">{{post.subtitle}}</h2>
      <div class="content" v-show="excerpt" v-html="post.excerpt"></div>
    </div>

    <footer class="card-footer">
      <nuxt-link :to="'/recipes/' + post.slug" class="card-footer-item">სრულად წაკითხვა</nuxt-link>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    post: Object,
    excerpt: Boolean
  }
};
</script>

<style>
</style>