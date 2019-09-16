<template>
  <div
    class="navbar-item has-dropdown"
    v-if="item.type === 'parent'"
    :key="item.id"
    :class="{'active': active}"
  >
    <a class="navbar-link" :style="'color:' + item.color" @click.stop="active=!active">{{item.title}}</a>

    <div class="navbar-dropdown" v-if="item.children">
      <nav-item v-for="child in item.children" :item="child" child :key="child.id" />
    </div>
  </div>

  <nuxt-link
    v-else-if="item.type === 'tag' && item.tag"
    :to="item | navLink"
    class="navbar-item"
    :key="item.id"
    :style="'color:' + item.color"
  >{{item.title}}</nuxt-link>

  <nuxt-link
    v-else-if="item.type === 'page' && item.page"
    :to="item | navLink"
    class="navbar-item"
    :key="item.id"
    :style="'color:' + item.color"
  >{{item.title}}</nuxt-link>

  <nuxt-link
    v-else-if="item.type === 'post' && item.post"
    :to="item | navLink"
    class="navbar-item"
    :key="item.id"
    :style="'color:' + item.color"
  >{{item.title}}</nuxt-link>

  <a
    :href="item.link"
    v-else-if="item.type === 'link'"
    :style="'color:' + item.color"
    class="navbar-item"
    rel="noopener"
    :target="item.external ? '_blank' : ''"
  >{{item.title}}</a>
</template>

<script>
import Vue from "vue";
export default Vue.component("nav-item", {
  name: "nav-item",
  data() {
    return {
      active: false
    };
  },
  props: {
    item: Object,
    child: Boolean
  }
});
</script>

<style>
</style>