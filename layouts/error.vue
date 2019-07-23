<template>
  <div class="error-page has-text-white hero">
    <div class="hero-body">
      <div class="container">
        <div class="icon">
          <i class="mdi mdi-alert-octagon"></i>
        </div>
        <h1 class="title" v-if="error.statusCode === 404">გვერდი ვერ მოიძებნა</h1>
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

    .icon {
      font-size: 140px;
      opacity: 0.8;
      margin-bottom: 60px;
    }
    
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