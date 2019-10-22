<template>
  <div
    class="ad-space"
    :class="{'ad-mobile': ad.mobile, 'ad-has-mobile-picture': ad.mobilePicture}"
    v-if="ad"
  >
    <a :href="ad.link" target="_blank" rel="noopener">
      <img class="ad-picture" :src="ad.picture" :alt="ad.text" :title="ad.text" />
      <img
        class="ad-picture-mobile"
        v-if="ad.mobilePicture"
        :src="ad.mobilePicture"
        :alt="ad.text"
        :title="ad.text"
      />
    </a>
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