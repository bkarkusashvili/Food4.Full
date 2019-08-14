<template>
  <div>
    <h1 class="title">მომხმარებლები</h1>

    
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: []
    };
  },
  asyncData({ $axios, error }) {
    return $axios
      .get("/api/admin/users")
      .then(response => {
        return { users: response.data };
      })
      .catch(err => {
        error({ statusCode: 500, message: "მოხდა შეცდომა" });
      });
  }
};
</script>

<style>
</style>