<template>
  <div class="page-section-carousel">
    <client-only>
      <hooper
        class="carousel"
        :infinite-scroll="true"
        :wheel-control="false"
        :auto-play="true"
        v-if="$store.state.settings && $store.state.settings.carousel && $store.state.settings.carousel.length"
      >
        <hooper-slide v-for="(item, index) in $store.state.settings.carousel" :key="index" :index="index">
          <div class="carousel-item-container">
            <div
              class="carousel-item flex flex-align-content-center flex-align-items-center flex-justify-content-center"
              v-if="item.post"
              :style="(item.post.picture || item.post.video) | youtubeThumb('maxresdefault') | cssbg"
            >
              <div class="carousel-item-content has-text-centered">
                <h1 class="title" v-if="item.post.title">{{item.post.title}}</h1>
                <h2 class="subtitle" v-if="item.post.subtitle">{{item.post.subtitle}}</h2>
                <nuxt-link
                  class="button is-success"
                  :to="item | navLink"
                  v-if="item.post.video"
                >ვიდეო რეცეპტზე გადასვლა</nuxt-link>
                <nuxt-link class="button is-success" :to="item | navLink" v-else>რეცეპტზე გადასვლა</nuxt-link>
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
        </hooper-slide>
      </hooper>
    </client-only>
  </div>
</template>

<script>
export default {
  name: "page-section-carousel",
  components: {},
  methods: {
    
  },
  props: {
    section: { type: Object, required: true }
  }
};
</script>

<style lang="scss">
.page-section-carousel {
  width: 100%;
  overflow: hidden;
  position: relative;

  .hooper {
    height: auto;
  }

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
      background: rgba(255, 255, 255, 0.6);
      padding: 1.5em;
      color: #2d2d2d;
      min-width: 25em;
      max-width: 70%;
      min-height: 11em;
      border-radius: 20px;
      flex-direction: column;
      display: flex;
      justify-content: center;
      align-items: center;

      .title {
        color: #373b3c;
      }

      .subtitle {
        color: #373b3c;
      }

      .button {
        background-color: #707e80;
        color: white;
        border-radius: 20px;
      }
    }
  }

  .VueCarousel-pagination {
    user-select: none;
    position: absolute;
    z-index: 9;
    bottom: 20px;

    .VueCarousel-dot {
      &.VueCarousel-dot--active {
        background-color: rgba(255, 255, 255, 0.5) !important;
      }
    }
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
      color: rgba(255, 255, 255, 0.8);

      &:hover {
        color: white;
      }
    }
  }
}
</style>