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
  },
  head () {
    let head = {
      title: this.$settings.title,
      meta: [
        { hid: 'description', name: 'description', content: this.$settings.description }
      ]
    };
    
    if (this.$settings.noIndex) {
      head.meta.push({ name: 'robots', content: 'noindex,nofollow' });
    }

    return head;
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
