<template>
  <div class="tag-page">
    <div class="container page-container">
      <h1 class="title">{{tag.title}}</h1>
      <div class="search-result columns" v-for="post in tag.posts" :key="post._id">
        <div class="result-image column is-one-quarter">
          <nuxt-link :to="'/recipes/' + post.slug">
            <img :src="post.picture" />
          </nuxt-link>
        </div>
        <div class="result-description column">
          <h1 class="title">
            <nuxt-link :to="'/recipes/' + post.slug">{{post.title}}</nuxt-link>
          </h1>
          <h2 class="subtitle">{{post.subtitle}}</h2>
          <div v-html="post.excerpt"></div>

          <nuxt-link
            :to="'/recipes/' + post.slug"
            class="button is-rounded is-primary is-large"
          >სრულად წაკითხვა</nuxt-link>

          <div class>
            <strong>ტეგები:</strong>

            <a
              v-for="tag in post.tags"
              class="tag is-medium"
              :key="tag._id"
              v-if="!tag.invisible"
            >{{tag.title}}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      tag: {}
    };
  },
  created() {},
  methods: {},
  watch: {},
  asyncData({ $axios, params, error }) {
    if (!params.id) return;
    return $axios
      .get("/api/tags/" + params.id)
      .then(response => {
        return { tag: response.data };
      })
      .catch(err => {
        console.error(err);
        error({ statusCode: 500 });
      });
  },
  head() {
    if (this.tag)
      return {
        title: this.tag.title + " - " + this.$settings.title
      };
  }
};
</script>

<style lang="scss">
.tag-page {
  padding-top: 2em;
}
</style>
