<template>
  <no-ssr>
    <div class="admin-page page-container">
      <div class="columns" style="margin:0">
        <aside class="menu column is-one-fifth admin-navigation">
          <p class="menu-label">
            <span class="icon">
              <i class="mdi mdi-folder"></i>
            </span>
            <span>შიგთავსი</span>
          </p>
          <ul class="menu-list">
            <li>
              <nuxt-link to="/admin/recipes" active-class="is-active">
                <span class="icon">
                  <i class="mdi mdi-file-document"></i>
                </span>
                <span>რეცეპტები</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/admin/tags" active-class="is-active">
                <span class="icon">
                  <i class="mdi mdi-tag"></i>
                </span>
                <span>ტეგები</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/admin/files" active-class="is-active">
                <span class="icon">
                  <i class="mdi mdi-file"></i>
                </span>
                <span>ფაილები</span>
              </nuxt-link>
            </li>
          </ul>
          <p class="menu-label">
            <span class="icon">
              <i class="mdi mdi-tune"></i>
            </span>
            <span>ადმინისტრაცია</span>
          </p>
          <ul class="menu-list">
            <li>
              <nuxt-link to="/admin/navigation" active-class="is-active">
                <span class="icon">
                  <i class="mdi mdi-book"></i>
                </span>
                <span>ნავიგაცია</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/admin/settings" active-class="is-active">
                <span class="icon">
                  <i class="mdi mdi-settings"></i>
                </span>
                <span>პარამეტრები</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/admin/users" active-class="is-active">
                <span class="icon">
                  <i class="mdi mdi-account"></i>
                </span>
                <span>მომხმარებლები</span>
              </nuxt-link>
              <!--<ul>
              <li>
                <a>Members</a>
              </li>
              <li>
                <a>Plugins</a>
              </li>
              <li>
                <a>Add a member</a>
              </li>
              </ul>-->
            </li>
          </ul>
        </aside>
        <nuxt-child class="column" />
      </div>
    </div>
  </no-ssr>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  created() {},
  methods: {},
  middleware: ["auth", "isAdmin"]
};
</script>

<style>
</style>
