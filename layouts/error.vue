<template>
  <div class="error-page has-text-white hero">
    <div class="hero-body">
      <div class="container">
        <h1 class="title" v-if="error.statusCode === 404">გვერდი არ არსებობს</h1>
        <h1 class="title" v-else>მოხდა შეცდომა</h1>
        <nuxt-link class="subtitle button is-link" to="/">მთავარ გვერდზე დაბრუნება</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["error"],
  layout: "default" // you can set a custom layout for the error page
};
</script>

<style lang="scss">
.error-page {
  text-align: center;

  .hero-body {
    padding: 0;

    .title {
      color: white;
    }

    .subtitle.subtitle {
      color: white;
      margin-top: 0;
    }
  }
}
</style>