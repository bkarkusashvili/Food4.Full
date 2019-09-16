<template>
  <div class="blog-post" :class="{ 'bordered': border, 'compact': compact }">
    <div class="post-image-container">
      <nuxt-link
        :to="'/blog/' + post.slug"
        class="post-image"
        :style="(post.thumb || post.picture || post.video) | youtubeThumb | cssbg"
        v-if="!noPicture"
      ></nuxt-link>
    </div>
    <div class="post-description">
      <div class="post-info">
        {{post.publishedAt | date}}
      </div>
      <nuxt-link class="post-title" :to="'/blog/' + post.slug">{{post.title}}</nuxt-link>

      <h2 class="post-subtitle" v-if="post.subtitle">{{post.subtitle}}</h2>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    post: Object,
    noPicture: { type: Boolean, default: false },
    border: Boolean,
    compact: Boolean
  }
};
</script>

<style lang="scss">
.blog-post {
  padding: 5px;
  margin-bottom: 15px;
  text-align: center;

  &.bordered {
    border-bottom: 1px solid #666;
  }

  &.compact {
    .post-title {
      font-size: 16px;
      margin-bottom: 8px;
    }
    .post-subtitle {
      font-size: 14px;
      margin-bottom: 8px;
    }
  }

  .post-image-container {
  }

  .post-image {
    width: 100%;
    display: block;
    padding-bottom: 100%;
    background-size: cover;
    background-position: center;
    border-radius: 100%;
  }

  .post-description {
  }

  .post-title {
    display: block;
    color: black;
    font-size: 22px;
    line-height: 1.3;
    margin-bottom: 8px;
    font-weight: normal;
    transition: color 0.3s;

    &:hover {
      color: #666;
    }
  }

  .post-subtitle {
    display: block;
    color: #555;
    font-size: 16px;
    line-height: 1;
    margin-bottom: 13px;
  }

  .post-link {
    display: block;
    padding: 5px 0;
    text-align: center;
  }
}
</style>