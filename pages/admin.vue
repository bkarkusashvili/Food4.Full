<template>
  <nuxt-child />
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  created() {},
  methods: {},
  middleware: [
    "auth",
    "isAdmin"
  ]
};
</script>

<style>
</style>
