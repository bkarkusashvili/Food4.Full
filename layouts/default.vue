<template>
  <div class="main-layout">
    <div class="secondary-navbar" style="background: #ddece5; height: 30px; flex-shrink: 0"></div>
    <site-navbar />
    <nuxt class="is-fullheight" ref="page" />
    <site-footer />
    <notifications group="main" position="bottom right" classes="notification vue-notification" :duration="10000" :max="5" />
  </div>
</template>

<script>
import Navbar from "~/components/Navbar.vue";
import Footer from "~/components/Footer.vue";

export default {
  components: {
    siteNavbar: Navbar,
    siteFooter: Footer
  }
};
</script>

<style lang="scss">
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;

  & > .is-fullheight {
    flex-grow: 1;
  }
}
</style>
