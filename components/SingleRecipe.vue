<template>
  <div class="single-recipe" :class="{ 'bordered': border, 'compact': compact }">
    <nuxt-link
      :to="'/recipes/' + post.slug"
      class="recipe-image"
      :style="(post.video || post.thumb || post.picture) | youtubeThumb | cssbg"
      v-if="!noPicture"
    ></nuxt-link>
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
    noPicture: { type: Boolean, default: false },
    border: Boolean,
    compact: Boolean
  }
};
</script>

<style lang="scss">
.single-recipe {
  padding: 5px;

  &.bordered {
    border-bottom: 1px solid #666;
  }

  &.compact {
  }

  .recipe-image {
    margin: 5px 0;
    width: 100%;
    display: block;
    padding-bottom: 56.25%;
    background-size: cover;
    background-position-y: center;
  }

  .recipe-description {
    padding: 5px 0;
  }

  .recipe-title {
    display: block;
    color: black;
    font-size: 22px;
    line-height: 1;
    margin-bottom: 13px;
    font-weight: normal;
    transition: color 0.3s;

    &:hover {
      color: #666;
    }
  }

  .recipe-subtitle {
    display: block;
    color: #555;
    font-size: 16px;
    line-height: 1;
    margin-bottom: 13px;
  }

  .recipe-excerpt {
    font-size: 16px;
    line-height: 27px;
  }

  .recipe-link {
    display: block;
    padding: 5px 0;
    text-align: center;
  }
}
</style>