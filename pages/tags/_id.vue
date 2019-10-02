<template>
  <div class="tag-page">
    <div class="container page-container">
      <h1 class="title">{{tag.title}}</h1>
      <div class="flex flex-row flex-wrap">
        <div class="recipe-container" v-for="post in tag.posts" :key="post._id">
          <single-recipe class="search-result" :post="post" v-if="post.type === 'recipe'" />
          <blog-post class="search-result" :post="post" v-if="post.type === 'blog'" />
          <news-post class="search-result" :post="post" v-if="post.type === 'news'" />
        </div>
      </div>
      <pagination :page="page" :total="total" :per-page="perPage" @goto="gotoPage" />
    </div>
  </div>
</template>

<script>
import SingleRecipe from "../../components/SingleRecipe";
import BlogPost from "../../components/BlogPost";
import NewsPost from "../../components/NewsPost";

export default {
  components: { SingleRecipe, BlogPost, NewsPost },
  data() {
    return {
      tag: {},
      total: 1,
      page: 1,
      perPage: 12
    };
  },
  created() {},
  methods: {
    fetchData() {
      this.$axios
        .get("/api/tags/" + this.$route.params.id)
        .then(response => {
          this.tag = response.data;
          let total = response.headers["x-total-count"];
          if (!isNaN(total)) this.total = parseInt(total);
        })
        .catch(err => {
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
    },
    gotoPage(page) {
      this.page = parseInt(page);
      this.fetchData();
    },
    queryParams() {
      return {
        offset: (this.page - 1) * this.perPage,
        limit: this.perPage
      };
    }
  },
  watch: {},
  asyncData({ $axios, params, error }) {
    if (!params.id) return;
    return $axios
      .get("/api/tags/" + params.id, {params: { perPage: 12 }})
      .then(response => {
        let data = { tag: response.data };
        let total = response.headers["x-total-count"];
        if (!isNaN(total)) data.total = parseInt(total);
        return data;
      })
      .catch(err => {
        console.error(err);
        error({ statusCode: 500 });
      });
  },
  head() {
    if (this.tag)
      return {
        title: this.tag.title + " - " + this.$store.state.settings.title,
        meta: [
          {
            hid: "og:title",
            name: "og:title",
            property: "og:title",
            content: this.tag.title + " - " + this.$store.state.settings.title
          }
        ]
      };
  }
};
</script>

<style lang="scss">
.tag-page {
  padding-top: 2em;
  padding-bottom: 2em;
}
</style>
