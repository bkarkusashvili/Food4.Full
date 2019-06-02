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
.main-layout {
    height: 100vh;
    display: flex;
    flex-direction: column;

    &>.is-fullheight {
      flex-grow: 1;
    }
}
</style>
