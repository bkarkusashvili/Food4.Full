<template>
  <div class="ad-space" v-if="ad"></div>
</template>

<script>
import Vue from "vue";
export default Vue.component("ad-space", {
  name: "ad-space",
  props: {
    ad: { type: Object }
  }
});
</script>

<style>
</style>