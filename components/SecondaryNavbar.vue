<template>
  <div class="secondary-navbar" v-if="true || $store.state.settings.socialLinks">
    <a
      target="_blank"
      rel="noopener"
      v-for="(link, index) in links"
      :key="index"
      :href="link.href"
      :style="'color:' + link.color"
    >
      <span class="icon" v-if="link.icon">
        <i class="mdi" :class="'mdi-'+ link.icon"></i>
      </span>
      <span>{{link.title}}</span>
    </a>
  </div>
</template>

<script>
export default {
  data() {
    return {
      links: [
        {
          icon: "facebook-box",
          title: "Facebook",
          href: "https://facebook.com",
          color: "#3b5998"
        },
        {
          icon: "instagram",
          title: "Instagram",
          href: "https://instagram.com",
          color: "#c13584"
        },
        {
          icon: "twitter",
          title: "Twitter",
          href: "https://twitter.com",
          color: "#1da1f2"
        }
      ]
    };
  }
};
</script>

<style>
.secondary-navbar {
  background: #ddece5;
  height: 30px;
  line-height: 30px;
  flex-shrink: 0;
  text-align: center;
}

.secondary-navbar a {
  margin-right: 0.5em;
}
</style>