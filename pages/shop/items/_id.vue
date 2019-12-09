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
        <div class="column" v-if="(item.pictures && item.pictures.length) || item.video">
          <siema
            class="carousel"
            ref="siema"
            v-if="(item.pictures && item.pictures.length) || item.video"
          >
            <div class="slide" v-if="item.video">
              <div class="item-video" v-if="item.video">
                <div class="youtube-embed">
                  <iframe
                    :src="item.video | youtubeEmbed"
                    frameborder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
              </div>
            </div>
            <div class="slide" v-for="(picture, index) in item.pictures" :key="index">
              <img class="item-picture" :src="picture" alt />
            </div>
          </siema>
        </div>
        <div class="column">
          <section class="item-header has-text-centered">
            <h1 class="title">{{item.title}}</h1>
          </section>

          <section class="item-description ql-editor" v-if="item.description">
            <div ref="description" v-html="item.description"></div>
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
      item: {}
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
      this.$router.push("/order/start");
    }
  },
  computed: {
    isInCart() {
      return (
        this.$store.state.cart &&
        this.$store.state.cart.items &&
        findIndex(this.$store.state.cart.items, this.item._id) !== -1
      );
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
.item-page .carousel {
  width: 100%;
  overflow: hidden;
}
</style>