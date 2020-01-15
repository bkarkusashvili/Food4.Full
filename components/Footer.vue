<template>
  <footer class="footer site-footer">
    <div class="content has-text-centered">
      <p>
        <strong>&copy; {{$store.state.settings.title}}</strong> ყველა უფლება დაცულია.
      </p>
      <client-only>
        <div id="top-ge-counter-container" data-site-id="113422"></div>
        <script async src="https://counter.top.ge/counter.js"></script>
      </client-only>
    </div>
  </footer>
</template>
<style>
.site-footer.site-footer.site-footer {
  background-color: #eeeeee;
}
</style>