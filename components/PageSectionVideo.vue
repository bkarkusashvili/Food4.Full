<template>
  <div class="page-section-video">
    <div class="youtube-embed" v-if="section.videoUrl">
      <iframe
        :src="section.videoUrl | youtubeEmbed"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
    <h1 v-if="section.title" class="title">{{section.title}}</h1>
    <p v-if="section.description" class="description">{{section.description}}</p>
  </div>
</template>

<script>
export default {
  name: "page-section-video",
  components: {},
  props: {
    section: Object
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
  computed: {}
};
</script>

<style>
.page-section-video .title {
  margin-top: 10px;
  font-size: 24px;
  margin-bottom: 12px;
}
</style>