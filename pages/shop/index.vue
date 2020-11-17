<template>
  <div class="shop-page">
    <div class="container">
      <h1 class="title has-text-centered flex-justify-content-center">მაღაზია</h1>

      <div class="flex flex-row flex-wrap flex-justify-content-center">
        <div class="item-container" v-for="item in items" :item-prop="item" :key="item._id">
          <shop-item :item-prop="item" />
        </div>
      </div>

      <pagination :page="page" :total="total" :per-page="perPage" @goto="gotoPage" />
    </div>
  </div>
</template>

<script>
import ShopItem from "../../components/ShopItem";

export default {
  components: { ShopItem },
  data() {
    return {
      items: [],
      total: 1,
      page: 1,
      perPage: 12
    };
  },
  methods: {
    fetchData() {
      this.$axios
        .get("/api/shop/items/", { params: this.queryParams() })
        .then(response => {
          this.items = response.data;
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
        offset: (this.page - 1) * this.perPage,
        limit: this.perPage
      };
    }
  },
  asyncData({ params, error, $axios }) {
    return $axios
      .get("/api/shop/items/")
      .then(response => {
        return { items: response.data };
      })
      .catch(err => {
        error({ statusCode: 500, message: "მოხდა შეცდომა!" });
      });
  }
};
</script>

<style>
</style>
