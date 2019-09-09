<template>
  <div class="page-section-row columns">
    <div
      class="page-section-column column"
      :class="computeClass(column)"
      v-for="column in section.columns"
    >
      <page-section :section="column.section" v-if="column.section" />
    </div>
  </div>
</template>

<script>
export default {
  name: "page-section-row",
  props: {
    section: { type: Object, required: true }
  },
  methods: {
    computeClass(column) {
      let clazz = { "is-narrow": column.narrow };
      if (column.size != null) clazz["is-" + column.size] = true;
      return clazz;
    }
  }
};
</script>

<style>
</style>