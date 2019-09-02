<template>
  <nav class="pagination is-centered" role="navigation" aria-label="pagination">
    <a class="pagination-previous" :disabled="!canGoBack">წინა გვერდი</a>
    <a class="pagination-next" :disabled="!canGoForward">შემდეგი გვერდი</a>
    <ul class="pagination-list">
      <li>
        <a class="pagination-link" aria-label="Goto page 1">1</a>
      </li>
      <li>
        <span class="pagination-ellipsis">&hellip;</span>
      </li>
      <li>
        <a class="pagination-link" aria-label="Goto page 45">45</a>
      </li>
      <li>
        <a class="pagination-link is-current" aria-label="Page 46" aria-current="page">46</a>
      </li>
      <li>
        <a class="pagination-link" aria-label="Goto page 47">47</a>
      </li>
      <li>
        <span class="pagination-ellipsis">&hellip;</span>
      </li>
      <li>
        <a class="pagination-link" aria-label="Goto page 86">{{pages}}</a>
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
    perPage: 10,
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