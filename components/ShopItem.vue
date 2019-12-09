<template>
  <div class="shop-item">
    <nuxt-link
      :to="'/shop/items/' + item.slug"
      class="item-image"
      :style="(item.thumb || item.video) | youtubeThumb | cssbg"
    ></nuxt-link>
    <div class="item-description">
      <nuxt-link class="item-title" :to="'/shop/items/' + item.slug">{{item.title}}</nuxt-link>
      <div class="item-excerpt" v-html="item.excerpt"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      item: {}
    };
  },
  methods: {
    fetchItem() {}
  },
  mounted() {
    if (typeof this.itemProp === "object") {
      this.item = this.itemProp;
    } else {
      this.fetchItem();
    }
  },
  props: {
    itemProp: Object,
    id: String
  }
};
</script>

<style>
</style>