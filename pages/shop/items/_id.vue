<template>
  <article class="item-page">
    <div class="container">
      <section class="item-header has-text-centered">
        <h1 class="title">{{item.title}}</h1>
      </section>

      <img class="item-picture" :src="item.picture" alt v-if="item.picture && !item.video" />

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

      <section class="item-description ql-editor" v-if="item.description">
        <div ref="description" v-html="item.description"></div>
      </section>

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
    }
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
}
</script>

<style>

</style>