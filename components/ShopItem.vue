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

<style lang="scss">
.shop-item {
  padding: 5px;

  &.bordered {
    border-bottom: 1px solid #666;
  }

  &.compact {
    .item-title {
      font-size: 16px;
      margin-bottom: 8px;
    }
    .item-subtitle {
      font-size: 14px;
      margin-bottom: 8px;
    }
    .item-excerpt {
      font-size: 14px;
      margin-bottom: 8px;
    }
  }

  .item-image {
    margin: 5px 0;
    width: 100%;
    display: block;
    padding-bottom: 56.25%;
    background-size: cover;
    background-position: center;
  }

  .item-description {
    padding: 5px 0;
  }

  .item-title {
    display: block;
    color: black;
    font-size: 18px;
    line-height: 1.3;
    margin-bottom: 13px;
    font-weight: normal;
    transition: color 0.3s;

    &:hover {
      color: #666;
    }
  }

  .item-subtitle {
    display: block;
    color: #555;
    font-size: 16px;
    line-height: 1;
    margin-bottom: 13px;
  }

  .item-excerpt {
    font-size: 16px;
    line-height: 27px;
  }

  .item-link {
    display: block;
    padding: 5px 0;
    text-align: center;
  }
}
</style>