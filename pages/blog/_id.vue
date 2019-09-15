<template>
  <article class="blog-page">
    <div class="container">
      <section class="post-header has-text-centered">
        <div class="post-info">{{post.publishedAt | date}}</div>
        <h1 class="title">{{post.title}}</h1>
        <h2 class="subtitle">{{post.subtitle}}</h2>
      </section>

      <img class="post-picture" :src="post.picture" alt v-if="!post.video && post.picture" />

      <div class="youtube-embed" v-if="post.video">
        <iframe
          :src="post.video | youtubeEmbed"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>

      <section class="post-content ql-editor">
        <div v-html="post.content"></div>
      </section>
    </div>
  </article>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      post: {}
    };
  },
  created() {},
  methods: {},
  watch: {},
  asyncData({ params, error, $axios }) {
    return $axios
      .get("/api/posts/" + params.id)
      .then(response => {
        return { post: response.data };
      })
      .catch(err => {
        error({ statusCode: 404, message: "პოსტი ვერ მოიძებნა" });
      });
  },
  head() {
    if (this.post)
      return {
        title: this.post.title + " - " + this.$store.state.settings.title
      };
  }
};
</script>

<style lang="scss">
.blog-page {
  .container {
    background: white;
  }

  .post-header {
    .title {
      color: black;
      font-size: 38px;
    }

    .post-info {
      color: #888;
      margin-bottom: 10px;
      font-size: 18px;
    }
  }

  .post-picture {
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
