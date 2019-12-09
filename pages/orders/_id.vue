<template></template>

<script>
export default {
  data() {
    return {
      order: {}
    };
  },
  asyncData({ params, error, $axios }) {
    return $axios
      .get("/api/user/orders/" + params.id)
      .then(response => {
        return { order: response.data };
      })
      .catch(err => {
        error({ statusCode: 404, message: "გვერდი ვერ მოიძებნა" });
      });
  },
  head() {
    return {
      meta: [{ name: "robots", content: "noindex,nofollow" }]
    };
  }
};
</script>

<style>
</style>