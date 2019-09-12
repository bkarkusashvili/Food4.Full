<template>
  <div class="page-section-carousel">
    <no-ssr>
      <carousel
        :per-page="1"
        autoplay
        v-if="$store.state.settings && $store.state.settings.carousel"
      >
        <slide v-for="(item, index) in $store.state.settings.carousel" :key="index">
          <div
            class="carousel-item flex flex-align-content-center flex-align-items-center flex-justify-content-center"
            v-if="item.post"
            :style="(item.post.video || item.post.picture) | youtubeThumb | cssbg"
          >
            <div class="carousel-item-content has-text-centered">
              <h1 class="title" v-if="item.post.title">{{item.post.title}}</h1>
              <h2 class="subtitle" v-if="item.post.subtitle">{{item.post.subtitle}}</h2>
              <nuxt-link class="button is-success" :to="item | navLink">რეცეპტზე გადასვლა</nuxt-link>
            </div>
          </div>
          <div
            class="carousel-item flex flex-align-content-center flex-align-items-center flex-justify-content-center"
            v-if="item.page"
            :style="(item.page.video || item.page.picture) | youtubeThumb | cssbg"
          >
            <div class="carousel-item-content has-text-centered">
              <h1 class="title" v-if="item.page.title">{{item.page.title}}</h1>
              <h2 class="subtitle" v-if="item.page.subtitle">{{item.page.subtitle}}</h2>
              <nuxt-link class="button is-success" :to="item | navLink">გვერდზე გადასვლა</nuxt-link>
            </div>
          </div>
        </slide>
      </carousel>
    </no-ssr>
  </div>
</template>

<script>
export default {
  name: "page-section-carousel",
  components: {},
  props: {
    section: { type: Object, required: true }
  }
};
</script>

<style lang="scss">
.page-section-carousel {
  .carousel-item {
    height: 400px;
    background-size: cover;
    background-position: 50% 50%;

    .carousel-item-content {
      background: rgba(0, 0, 0, 0.5);
      padding: 2em;
      color: white;

      .title {
        color: white;
      }

      .subtitle {
        color: white;
      }
    }
  }
}
</style>