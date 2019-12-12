<template>
  <article class="item-page">
    <div class="container page-container">
      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <nuxt-link to="/shop">მაღაზია</nuxt-link>
          </li>
          <li v-if="item.category">
            <nuxt-link :to="'/shop/' + item.category.slug">{{item.category.title}}</nuxt-link>
          </li>
          <li class="is-active">
            <a href="#" aria-current="page">{{item.title}}</a>
          </li>
        </ul>
      </nav>

      <div class="columns">
        <div class="column carousel-container" v-if="slides.length">
          <client-only>
            <siema class="carousel" ref="siema" v-if="slides.length" :current.sync="curSlide">
              <div class="slide has-text-centered" v-for="(slide, index) in slides" :key="index">
                <img class="item-picture" :src="slide.url" alt v-if="slide.type === 'picture'" />
                <div class="youtube-embed" v-if="slide.type === 'video'">
                  <iframe
                    :src="item.video | youtubeEmbed"
                    frameborder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
              </div>
            </siema>
          </client-only>

          <div class="tabs carousel-selector is-centered">
            <ul>
              <li
                v-for="(slide, index) in slides"
                :key="index"
                :class="{'is-active': curSlide === index}"
              >
                <a @click="selectSlide(index)">
                  <img :src="slide.thumb | youtubeThumb" />
                  <span class="play-icon" v-if="slide.type === 'video'">
                    <i class="mdi mdi-play"></i>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="column">
          <section class="item-header has-text-centered">
            <h1 class="title">{{item.title}}</h1>
          </section>

          <section class="item-description" v-if="item.description">
            <div class="ql-editor" ref="description" v-html="item.description"></div>
          </section>

          <section class="has-text-centered">
            <div v-if="item.stock">
              <div class="item-price">
                ფასი:
                <strong>{{item.price | price}}</strong>
              </div>
              <button
                type="button"
                class="button"
                :class="{'is-success': !isInCart}"
                @click="addToCart()"
              >
                <span class="icon">
                  <i class="mdi mdi-cart" v-show="!isInCart"></i>
                  <i class="mdi mdi-check" v-show="isInCart"></i>
                </span>
                <span v-show="!isInCart">კალათში დამატება</span>
                <span v-show="isInCart">კალათში დამატებულია</span>
              </button>
              <button type="button" class="button is-success" @click="buy()">
                <span class="icon">
                  <i class="mdi mdi-cart"></i>
                </span>
                <span>ყიდვა</span>
              </button>
            </div>
            <div v-else>სამწუხაროდ მარაგი ამოწურულია!</div>
          </section>
        </div>
      </div>

      <client-only>
        <div
          class="fb-like"
          data-href="https://facebook.com/food4.ge"
          data-width
          data-layout="button"
          data-action="like"
          data-size="large"
          data-show-faces="false"
          data-share="false"
        ></div>
        <div
          class="fb-share-button"
          :data-href="'https://food4.ge' + $route.path"
          data-layout="button_count"
          data-size="large"
        >
          <a
            target="_blank"
            :href="'https://www.facebook.com/sharer/sharer.php?u=https://food4.ge' + $route.path"
            class="fb-xfbml-parse-ignore"
          >გაზიარება</a>
        </div>

        <div
          class="fb-comments"
          :data-href="'https://food4.ge' + $route.path"
          data-width="100%"
          data-numposts="5"
        ></div>
      </client-only>
    </div>
  </article>
</template>

<script>
export default {
  data() {
    return {
      item: {},
      curSlide: 0
    };
  },
  asyncData({ params, error, $axios }) {
    return $axios
      .get("/api/shop/items/" + params.id)
      .then(response => {
        return { item: response.data };
      })
      .catch(err => {
        error({ statusCode: 404, message: "გვერდი ვერ მოიძებნა" });
      });
  },
  methods: {
    addToCart() {
      this.$store.commit("cart/add", this.item);
    },
    buy() {
      if (!this.isInCart) this.addToCart();
      this.$router.push("/order");
    },
    selectSlide(index) {
      this.$refs.siema.goTo(index);
    }
  },
  computed: {
    isInCart() {
      return (
        this.$store.state.cart &&
        this.$store.state.cart.items &&
        findIndex(this.$store.state.cart.items, this.item._id) !== -1
      );
    },
    slides() {
      let slides = [];
      if (!this.item) return slides;

      if (this.item.video)
        slides.push({
          type: "video",
          url: this.item.video,
          thumb: this.item.video
        });

      if (this.item.pictures && this.item.pictures.length) {
        this.item.pictures.forEach(picture => {
          slides.push({
            type: "picture",
            url: picture.url,
            thumb:
              (picture.variants &&
                picture.variants.thumb &&
                picture.variants.thumb.url) ||
              picture.url
          });
        });
      }

      return slides;
    }
  }
};

function findIndex(items, _id) {
  for (let i = 0; i < items.length; i++) {
    if (items[i]._id === _id) return i;
  }
  return -1;
}
</script>

<style>
.item-page .carousel-container {
  width: 100%;
  overflow: hidden;
}

.item-page .carousel-selector ul {
  align-items: stretch;
}

.item-page .carousel-selector a {
  height: 100%;
  position: relative;
}

.item-page .carousel-selector img {
  max-width: 5em;
}

.item-page .carousel-selector .play-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  font-size: 32px;
  color: white;
  margin-left: -16px;
  margin-top: -24px;
  text-shadow: 0 0 5px black;
}
</style>