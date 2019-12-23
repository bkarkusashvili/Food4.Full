<template>
  <div class="shop-category-page">
    <div class="container">
      <nav class="breadcrumb title" aria-label="breadcrumbs">
        <ul class="flex-justify-content-center">
          <li>
            <nuxt-link to="/shop">მაღაზია</nuxt-link>
          </li>
          <li class="is-active">
            <a href="#">{{category.title}}</a>
          </li>
        </ul>
      </nav>

      <div class="flex flex-row flex-wrap flex-justify-content-center">
        <div
          class="item-container"
          v-for="item in category.items"
          :item-prop="item"
          :key="item._id"
        >
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