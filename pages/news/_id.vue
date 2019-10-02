<template>
  <article class="news-page">
    <div class="container">
      <section class="post-header">
        <div class="post-info">{{post.publishedAt | date}}</div>
        <h1 class="title">{{post.title}}</h1>
        <h2 class="subtitle">{{post.subtitle}}</h2>
      </section>

      <img class="post-image" :src="post.picture" alt v-if="post.picture && !post.video" />

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
    if (!this.post) return;

    let head = {
      title: this.post.title + " - " + this.$store.state.settings.title,
      meta: [
        {
          hid: "og:type",
          property: "og:type",
          content: "article"
        },
        {
          hid: "og:title",
          property: "og:title",
          content: this.post.title + " - " + this.$store.state.settings.title
        }
      ]
    };

    if (this.post.excerpt) {
      head.meta.push({
        hid: "og:description",
        property: "og:description",
        content: this.post.excerpt
      });

      head.meta.push({
        hid: "description",
        content: this.post.excerpt
      });
    }

    if (this.post.picture) {
      head.meta.push({
        hid: "og:image",
        property: "og:image",
        content: "https://food4.ge" + this.post.picture
      });
    } else if (this.post.video) {
      head.meta.push({
        hid: "og:image",
        property: "og:image",
        content: this.$options.filters.youtubeThumb(this.post.video)
      });
    }

    return head;
  }
};
</script>

<style lang="scss">
.news-page {
  .container {
    background: white;
  }

  .post-header {
    text-align: center;
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

  .post-image {
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
