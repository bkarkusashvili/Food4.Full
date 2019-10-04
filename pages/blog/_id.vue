<template>
  <article class="blog-page">
    <div class="container">
      <div class="flex">
        <div class="picture-container">
          <div class="post-image" v-if="post.picture" :style="(post.thumb || post.picture) | cssbg"></div>
        </div>
        <div class="flex-grow-1">
          <section class="post-header">
            <div class="post-info">{{post.publishedAt | date}}</div>
            <h1 class="title">{{post.title}}</h1>
            <h2 class="subtitle">{{post.subtitle}}</h2>
          </section>

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
      </div>
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

  .picture-container {
    text-align: center;
  }
  .post-image {
    width: 300px;
    height: 300px;
    background-size: cover;
    background-position: center;
    border-radius: 100%;
    margin: 0 auto;
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
