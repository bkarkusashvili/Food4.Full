<template></template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  created() {
    $route.replace();
  },
  methods: {},
  render: {
    ssr: false
  },
  fetch({ params, redirect }) {
    redirect(301, '/admin/recipes');
  }
};
</script>

<style>
</style>
