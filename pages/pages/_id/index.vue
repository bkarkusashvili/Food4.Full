<template>
  <article class="page-page">
    <div class="container">
      <section class="page-header has-text-centered">
        <h1 class="title">{{page.title}}</h1>
        <h2 class="subtitle">{{page.subtitle}}</h2>
      </section>

      <img class="page-picture" :src="page.picture" alt v-if="!page.video && page.picture" />

      <div class="youtube-embed" v-if="page.video">
        <iframe
          :src="page.video | youtubeEmbed"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>

      <section class="page-content ql-editor">
        <div v-html="page.content"></div>
      </section>
    </div>
  </article>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      page: {}
    };
  },
  created() {},
  methods: {},
  watch: {},
  asyncData({ params, error, $axios }) {
    return $axios
      .get("/api/pages/" + params.id)
      .then(response => {
        return { page: response.data };
      })
      .catch(err => {
        error({ statusCode: 404, message: "გვერდი ვერ მოიძებნა" });
      });
  },
  head() {
    if (this.page)
      return {
        title: this.page.title + " - " + this.$store.state.settings.title,
        meta: [
          {
            hid: "og:title",
            name: "og:title",
            property: "og:title",
            content: this.page.title + " - " + this.$store.state.settings.title
          }
        ]
      };
  }
};
</script>

<style lang="scss">
.page-page {
  .container {
    background: white;
  }

  .page-header {
    padding-top: 4em;

    .title {
      color: black;
      font-size: 38px;
    }

    .page-info {
      color: #888;
      margin-bottom: 10px;
      font-size: 18px;
    }
  }

  .page-picture {
    display: block;
    margin: 0 auto;
    max-height: 400px;
  }

  .hero {
    min-height: 300px;
  }

  section {
    padding: 20px;
  }

  .section-header {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 0.5em;
  }
}
</style>
