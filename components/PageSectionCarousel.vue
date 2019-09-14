<template>
  <div class="page-section-carousel">
    <no-ssr>
      <carousel
        class="carousel"
        :per-page="1"
        autoplay
        navigation-enabled
        v-if="$store.state.settings && $store.state.settings.carousel"
      >
        <slide v-for="(item, index) in $store.state.settings.carousel" :key="index">
          <div class="carousel-item-container">
            <div
              class="carousel-item flex flex-align-content-center flex-align-items-center flex-justify-content-center"
              v-if="item.post"
              :style="(item.post.picture || item.post.video) | youtubeThumb('maxresdefault') | cssbg"
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
  .carousel-item-container {
    position: relative;
    height: 0;
    padding-bottom: 56.25%;
  }

  .carousel-item {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: 50% 50%;

    .carousel-item-content {
      background: rgba(255, 184, 83, 0.7);
      padding: 2em;
      color: white;
      min-width: 25em;
      min-height: 12em;
      flex-direction: column;
      display: flex;
      justify-content: center;

      .title {
        color: white;
      }

      .subtitle {
        color: white;
      }

      .button {
        background-color: rgb(249, 171, 59);
      }
    }
  }

  .VueCarousel-pagination {
    user-select: none;
    position: absolute;
    z-index: 9;
    bottom: 20px;
  }

  .VueCarousel-navigation {
    user-select: none;
    position: absolute;
    left: 15px;
    bottom: 15px;
    z-index: 10;

    .VueCarousel-navigation-button {
      position: static;
      transform: none;
      display: inline-block;
      padding: 7px 12px 10px 12px !important;
      margin: 0 !important;
      font-size: 20px;
      background: rgba(0, 0, 0, 0.5);
      color: white;
    }
  }
}
</style>