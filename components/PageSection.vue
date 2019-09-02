<template>
  <div class="page-section">
    <page-section-html v-if="section.type === 'html'" :section="section" />
    <page-section-row v-if="section.type === 'row'" :section="section" />
    <page-section-tiles v-if="section.type === 'tiles'" :section="section" />
    <page-section-tabs v-if="section.type === 'tabs'" :section="section" />
    <page-section-hero v-if="section.type === 'hero'" :section="section" />
    <page-section-tags v-if="section.type === 'tags'" :section="section" />
    <page-section-latest v-if="section.type === 'latest'" :section="section" />
    <page-section-featured v-if="section.type === 'featured'" :section="section" />
    <page-section-video v-if="section.type === 'video'" :section="section" />
  </div>
</template>

<script>
import Vue from "vue";
import PageSectionRow from "./PageSectionRow";
import PageSectionHTML from "./PageSectionHTML";
import PageSectionTabs from "./PageSectionTabs";
import PageSectionHero from "./PageSectionHero";
import PageSectionTags from "./PageSectionTags";
import PageSectionLatest from "./PageSectionLatest";
import PageSectionFeatured from "./PageSectionFeatured";
import PageSectionVideo from "./PageSectionVideo";
import PageSectionTiles from "./PageSectionTiles";

export default Vue.component("page-section", {
  name: "page-section",
  components: {
    "page-section-row": PageSectionRow,
    "page-section-html": PageSectionHTML,
    "page-section-tabs": PageSectionTabs,
    "page-section-hero": PageSectionHero,
    "page-section-tags": PageSectionTags,
    "page-section-latest": PageSectionLatest,
    "page-section-featured": PageSectionFeatured,
    "page-section-video": PageSectionVideo,
    "page-section-tiles": PageSectionTiles
  },
  props: {
    section: Object
  }
});
</script>

<style>
</style>