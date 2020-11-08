<template>
  <div class="page-section-shop" :class="{'compact': section.compact}">
    <h1 v-if="section.title" class="title">{{section.title}}</h1>

    <div class="flex flex-row flex-wrap flex-justify-content-center">
      <div class="item-container" v-for="item in items" :item-prop="item" :key="item._id">
        <shop-item :item-prop="item" />
      </div>
    </div>
  </div>
</template>

<script>
import ShopItem from "./ShopItem";

export default {
  components: { ShopItem },
  props: {
    section: { type: Object, required: true }
  },
  data() {
    return {
      items: []
    };
  },
  methods: {
    fetchItems() {
      return this.$axios
        .get("/api/shop/items/")
        .then(response => {
          this.items = response.data;
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  mounted() {
    this.fetchItems();
  }
};
</script>

<style>
</style>
