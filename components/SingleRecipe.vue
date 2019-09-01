<template>
  <div class="single-recipe" :class="{ 'bordered': border }">
    <div class="recipe-image" v-if="post.picture && !noPicture">
      <nuxt-link :to="'/recipes/' + post.slug">
        <img :src="post.picture" />
      </nuxt-link>
    </div>
    <div class="recipe-description">
      <nuxt-link class="recipe-title" :to="'/recipes/' + post.slug">{{post.title}}</nuxt-link>

      <h2 class="recipe-subtitle">{{post.subtitle}}</h2>
      <div class="recipe-excerpt" v-show="excerpt" v-html="post.excerpt"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    post: Object,
    excerpt: Boolean,
    noPicture: Boolean,
    border: Boolean,
  }
};
</script>

<style lang="scss">
.single-recipe {
  &.bordered {
    border-bottom: 1px solid #666
  }

  .recipe-image {
    padding: 5px;
    font-size: 0;
  }

  .recipe-description {
    padding: 5px;
  }

  .recipe-title {
    color: black;
    font-weight: bold;
    font-size: 27px;
    line-height: 36px;
    margin-bottom: 13px;
    transition: color 0.3s;

    &:hover {
      color: #666;
    }
  }

  .recipe-subtitle {
    color: #555;
    font-size: 20px;
    line-height: 27px;
    margin-bottom: 13px;
  }

  .recipe-excerpt {
    font-size: 16px;
    line-height: 27px;
  }

  .recipe-link {
    display: block;
    padding: 5px;
    text-align: center;
  }
}
</style>