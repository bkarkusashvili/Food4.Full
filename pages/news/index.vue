<template>
  <div class="blog-index-page">
    <div class="container page-container">
      <!-- <h1 class="title">ბლოგი</h1> -->
      <div class="flex flex-row flex-wrap">
        <div class="recipe-container">
          <blog-post :post="post" v-for="post in posts" :key="post._id" />
        </div>
      </div>
      <pagination :page="page" :total="total" :per-page="perPage" @goto="gotoPage" />
    </div>
  </div>
</template>

<script>
import NewsPost from "../../components/NewsPost";

export default {
  components: { NewsPost },
  data() {
    return {
      posts: [],
      total: 1,
      page: 1,
      perPage: 12
    };
  },
  created() {},
  methods: {
    fetchData() {
      this.$axios
        .get("/api/posts/latest", { params: this.queryParams() })
        .then(response => {
          this.posts = response.data;
          let total = response.headers["x-total-count"];
          if (!isNaN(total)) this.total = parseInt(total);
        })
        .catch(err => {
          console.error(err);
        });
    },
    gotoPage(page) {
      this.page = parseInt(page);
      this.fetchData();
    },
    queryParams() {
      return {
        type: "news",
        offset: (this.page - 1) * this.perPage,
        limit: this.perPage
      };
    }
  },
  watch: {
  },
  asyncData({ $axios, error }) {
    return $axios
      .get("/api/posts/latest", { params: { type: "news" } })
      .then(response => {
        let data = { posts: response.data };
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
    return {
      title: "ახალი რეცეპტები - " + this.$store.state.settings.title
    };
  }
};
</script>

<style lang="scss">
.blog-index-page {
  padding: 1.5em;
}
</style>
