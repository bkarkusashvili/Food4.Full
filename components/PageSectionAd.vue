<template>
  <div class="page-section-ad">
      <ad-space :ad="section.ad" />
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