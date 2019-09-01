<template>
  <div class="main-layout">
    <secondary-navbar />
    <site-navbar />
    <nuxt class="is-fullheight" ref="page" />
    <site-footer />
    <notifications
      group="main"
      position="bottom right"
      classes="notification vue-notification"
      :duration="10000"
      :max="5"
    />
  </div>
</template>

<script>
import Navbar from "~/components/Navbar.vue";
import SecondaryNavbar from "~/components/SecondaryNavbar.vue";
import Footer from "~/components/Footer.vue";

export default {
  data() {
    return {};
  },
  components: {
    siteNavbar: Navbar,
    siteFooter: Footer,
    SecondaryNavbar: SecondaryNavbar
  },
  head() {
    let head = {
      title: this.$store.state.settings.title,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$store.state.settings.description
        }
      ]
    };

    if (this.$store.state.settings.noIndex) {
      head.meta.push({ name: "robots", content: "noindex,nofollow" });
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
