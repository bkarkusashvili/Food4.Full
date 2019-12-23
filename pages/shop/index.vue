<template>
  <div class="shop-page">
    <div class="container">
      <h1 class="title has-text-centered flex-justify-content-center">მაღაზია</h1>

      <div class="flex flex-row flex-wrap flex-justify-content-center">
        <div class="item-container" v-for="item in items" :item-prop="item" :key="item._id">
          <shop-item :item-prop="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ShopItem from "../../components/ShopItem";

export default {
  components: { ShopItem },
  data() {
    return {
      items: []
    };
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