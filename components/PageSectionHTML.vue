<template>
  <div class="page-section-html content" v-html="section.content"></div>
</template>

<script>
export default {
  name: "page-section-html",
  props: {
    section: Object
  }
};
</script>

<style>
</style>