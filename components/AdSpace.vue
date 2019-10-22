<template>
  <div class="ad-space" v-if="ad">
    <a :href="ad.link" target="_blank" rel="noopener"><img 
      :src="ad.picture" 
      :alt="ad.text" 
      :title="ad.text" /></a>
  </div>
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