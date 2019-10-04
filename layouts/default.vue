<template>
  <div class="main-layout">
    <div class="navs">
      <secondary-navbar />
      <site-navbar />
    </div>
    <nuxt class="is-fullheight" ref="page" />
    <site-footer />
    <notifications
      group="main"
      position="bottom right"
      classes="notification vue-notification"
      :duration="10000"
      :max="5"
    />
    <client-only>
      <!-- Global site tag (gtag.js) - Google Analytics -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-148021181-1"></script>
      <script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());

  gtag("config", "UA-148021181-1");
      </script>

      <div id="fb-root"></div>
      <script
        async
        defer
        crossorigin="anonymous"
        src="https://connect.facebook.net/ka_GE/sdk.js#xfbml=1&version=v4.0&appId=3019510804998107&autoLogAppEvents=1"
      ></script>
    </client-only>
  </div>
</template>

<script>
import Navbar from "~/components/Navbar.vue";
import SecondaryNavbar from "~/components/SecondaryNavbar.vue";
import Footer from "~/components/Footer.vue";
import Pagination from "~/components/Pagination.vue";
import AdSpace from "~/components/AdSpace.vue";

export default {
  data() {
    return {};
  },
  components: {
    siteNavbar: Navbar,
    siteFooter: Footer,
    SecondaryNavbar: SecondaryNavbar,
    Pagination: Pagination
  },
  head() {
    let head = {
      title: this.$store.state.settings.title,
      link: [
        {
          rel: "canonical",
          href: "https://food4.ge" + this.$route.path
        }
      ],
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$store.state.settings.description
        },
        {
          hid: "og:description",
          property: "og:description",
          content: this.$store.state.settings.description
        },
        {
          hid: "og:title",
          property: "og:title",
          content: this.$store.state.settings.title
        },
        {
          hid: "og:site_name",
          property: "og:site_name",
          content: this.$store.state.settings.title
        },
        {
          hid: "og:image",
          property: "og:image",
          content: "https://food4.ge" + this.$store.state.settings.logo
        },
        {
          hid: "apple-mobile-web-app-title",
          property: "apple-mobile-web-app-title",
          content: this.$store.state.settings.title
        }
      ]
    };

    if (this.$store.state.settings.noIndex) {
      head.meta.push({ name: "robots", content: "noindex,nofollow" });
    }

    return head;
  },
  watch: {
    '$route': function() {
      if(process.browser && FB) {
        setTimeout(()=>FB.XFBML.parse(), 500);
      }
    }
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
