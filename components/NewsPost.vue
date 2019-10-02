<template>
  <div class="single-recipe has-text-centered" :class="{ 'bordered': border, 'compact': compact }">
    <a
      v-if="post.link"
      :href="post.link"
      rel="noopener"
      target="_blank"
      class="recipe-image"
      :style="(post.thumb || post.picture || post.video) | youtubeThumb | cssbg"
    ></a>
    <nuxt-link
      v-else
      :to="'/news/' + post.slug"
      class="recipe-image"
      :style="(post.thumb || post.picture || post.video) | youtubeThumb | cssbg"
    ></nuxt-link>
    <div class="recipe-description">
      <a
        v-if="post.link"
        :href="post.link"
        rel="noopener"
        target="_blank"
        class="recipe-title"
      >{{post.title}}</a>
      <nuxt-link v-else class="recipe-title" :to="'/news/' + post.slug">{{post.title}}</nuxt-link>

      <h2 class="recipe-subtitle" v-if="post.subtitle">{{post.subtitle}}</h2>
      <div class="recipe-excerpt" v-show="excerpt" v-html="post.excerpt"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    post: Object,
    excerpt: Boolean,
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
    .recipe-title {
      font-size: 16px;
      margin-bottom: 8px;
    }
    .recipe-subtitle {
      font-size: 14px;
      margin-bottom: 8px;
    }
    .recipe-excerpt {
      font-size: 14px;
      margin-bottom: 8px;
    }
  }

  .recipe-image {
    margin: 5px 0;
    width: 100%;
    display: block;
    padding-bottom: 56.25%;
    background-size: cover;
    background-position: center;
  }

  .recipe-description {
    padding: 5px 0;
  }

  .recipe-title {
    display: block;
    color: black;
    font-size: 18px;
    line-height: 1.3;
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