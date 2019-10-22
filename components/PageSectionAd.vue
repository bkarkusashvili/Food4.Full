<template>
  <div class="page-section-ad">
    <ad-space :ad="$store.state.settings.ads[section.ad]" v-if="section.ad && $store.state.settings.ads" />
  </div>
</template>

<script>
export default {
  name: "page-section-ad",
  props: {
    section: { type: Object, required: true }
  }
};
</script>

<style>
</style>