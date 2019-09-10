<template>
  <nav class="pagination is-centered" role="navigation" aria-label="pagination" v-if="pages > 1">
    <a class="pagination-previous" :disabled="!canGoBack">წინა გვერდი</a>
    <a class="pagination-next" :disabled="!canGoForward">შემდეგი გვერდი</a>
    <ul class="pagination-list">
      <li v-if="page > 3">
        <a class="pagination-link" aria-label="გვერდი 1" :disabled="!canGoBack">1</a>
      </li>
      <li v-if="page > 3">
        <span class="pagination-ellipsis">&hellip;</span>
      </li>
      <li v-if="page > 1">
        <a class="pagination-link" aria-label="წინა გვერდი">{{page-1}}</a>
      </li>
      <li>
        <a class="pagination-link is-current" aria-label="ახლანდელი გვერდი" aria-current="page">{{page}}</a>
      </li>
      <li v-if="page < pages">
        <a class="pagination-link" aria-label="შემდეგი გვერდი">{{page+1}}</a>
      </li>
      <li v-if="page < pages - 3">
        <span class="pagination-ellipsis">&hellip;</span>
      </li>
      <li v-if="page < pages - 3">
        <a class="pagination-link" aria-label="ბოლო გვერდი" :disabled="!canGoForward">{{pages}}</a>
      </li>
    </ul>
  </nav>
</template>

<script>
import Vue from "vue";

export default Vue.component("pagination", {
  name: "pagination",
  props: {
    page: Number,
    perPage: {
      type: Number,
      default: 10
    },
    total: Number
  },
  computed: {
    pages() {
      if (!this.perPage || !this.total) return 1;
      return Math.ceil(this.total / this.perPage);
    },
    canGoBack() {
      return this.page > 1;
    },
    canGoForward() {
      return this.page < this.pages;
    }
  }
});
</script>

<style>
</style>