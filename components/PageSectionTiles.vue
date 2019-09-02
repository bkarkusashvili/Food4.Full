<template>
  <div class="page-section-tiles">
    <tile v-for="(tile, index) in section.tiles" :key="index" :tile="tile" />
  </div>
</template>

<script>
import Tile from "./Tile";

export default {
  name: "page-section-tiles",
  props: {
    section: Object
  },
  methods: {}
};
</script>

<style>
</style>