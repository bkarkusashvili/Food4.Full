<template>
  <div class="shop-category-page">
    <div class="container">
      <h1 class="title">{{category.title}}</h1>

      <shop-item v-for="item in category.items" :item-prop="item" :key="item._id" />
    </div>
  </div>
</template>

<script>
import ShopItem from "../../components/ShopItem";

export default {
  components: { ShopItem },
  data() {
    return {
      category: {}
    };
  },
  asyncData({ params, error, $axios }) {
    return $axios
      .get("/api/shop/categories/" + params.id)
      .then(response => {
        return { category: response.data };
      })
      .catch(err => {
        error({ statusCode: 404, message: "გვერდი ვერ მოიძებნა" });
      });
  }
};
</script>

<style>
</style>