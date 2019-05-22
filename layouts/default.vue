<template>
  <div class="main-layout">
    <site-navbar/>
    <nuxt class="is-fullheight" />
    <site-footer/>
  </div>
</template>

<script>
import Navbar from '~/components/Navbar.vue'
import Footer from '~/components/Footer.vue'

export default {
  components: {
    siteNavbar: Navbar,
    siteFooter: Footer
  }
}
</script>

<style lang="scss">
html {
  font-family: 'Noto Serif Georgian', 'Noto Sans Georgian', 'Noto Sans', 'Roboto', sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
.main-layout {
    height: 100vh;
    display: flex;
    flex-direction: column;

    &>.is-fullheight {
      flex-grow: 1;
    }
}
</style>
