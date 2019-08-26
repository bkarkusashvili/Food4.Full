<template>
  <nav class="navbar site-navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <nuxt-link to="/" class="navbar-item has-text-weight-bold">
        <img :src="$settings.logo" alt />
      </nuxt-link>

      <a
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        :class="{ 'is-active': showNav }"
        :aria-expanded="String(showNav)"
        @click="toggleNav()"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div class="navbar-menu" :class="{ 'is-active': showNav }">
      <div class="navbar-start">
        <template v-for="item in $settings.navigation">
          <div
            class="navbar-item has-dropdown is-hoverable"
            v-if="item.type === 'parent'"
            :key="item.id"
          >
            <a class="navbar-link">{{item.title}}</a>
            <div class="navbar-dropdown" v-if="item.type === 'parent'">
              <template v-for="child in item.children">
                <nuxt-link
                  :key="child.id"
                  v-if="child.type === 'tag'"
                  :to="'/tags/' + child.tag.slug"
                  class="navbar-item"
                >{{child.title}}</nuxt-link>
                <nuxt-link
                  :key="child.id"
                  v-if="child.type === 'page'"
                  :to="'/pages/' + child.page.slug"
                  class="navbar-item"
                >{{child.title}}</nuxt-link>
                <a
                  :key="child.id"
                  :href="child.link"
                  v-if="child.type === 'link'"
                  class="navbar-item"
                >{{child.title}}</a>
              </template>
            </div>
          </div>
          <nuxt-link
            v-if="item.type === 'tag'"
            :to="'/tags/' + item.tag.slug"
            class="navbar-item"
            :key="item.id"
          >{{item.title}}</nuxt-link>

          <nuxt-link
            v-if="item.type === 'page'"
            :to="'/pages/' + item.page.slug"
            class="navbar-item"
            :key="item.id"
          >{{item.title}}</nuxt-link>
          <a :href="item.link" v-if="item.type === 'link'" class="navbar-item">{{item.title}}</a>
        </template>
      </div>

      <div class="navbar-end" v-show="!showingSearch">
        <a class="navbar-item" @click="showSearch()">
          <span class="icon">
            <i class="mdi mdi-magnify"></i>
          </span>
          <span>ძებნა</span>
        </a>
        <nuxt-link to="/login" class="navbar-item" v-if="!$auth.user">შესვლა / რეგისტრაცია</nuxt-link>
        <div class="navbar-item has-dropdown is-hoverable" v-if="$auth.user">
          <a class="navbar-link">
            <span class="icon">
              <i class="mdi mdi-account" aria-hidden="true"></i>
            </span>
            <span>{{$auth.user.name}}</span>
          </a>
          <div class="navbar-dropdown">
            <nuxt-link to="/admin" class="navbar-item" v-if="$auth.user.role === 'admin'">
              <span class="icon">
                <i class="mdi mdi-radioactive" aria-hidden="true"></i>
              </span>
              <span>სამართავი პანელი</span>
            </nuxt-link>
            <a class="navbar-item">
              <span class="icon">
                <i class="mdi mdi-account" aria-hidden="true"></i>
              </span>
              <span>პროფილი</span>
            </a>
            <a class="navbar-item" v-if="$auth.user" @click="logout">
              <span class="icon">
                <i class="mdi mdi-exit-run" aria-hidden="true"></i>
              </span>
              <span>გასვლა</span>
            </a>
          </div>
        </div>
      </div>
      <div class="navbar-end" v-show="showingSearch">
        <form @submit.prevent="search()" class="navbar-item">
          <div class="dropdown" :class="{'is-active': searchSuggestions.length}">
            <div class="dropdown-trigger">
              <div class="field has-addons">
                <div class="control">
                  <button
                    class="button is-dark"
                    type="reset"
                    title="დაბრუნება"
                    @click="hideSearch()"
                  >
                    <span class="icon">
                      <i class="mdi mdi-close"></i>
                    </span>
                  </button>
                </div>
                <div class="control">
                  <input
                    class="input is-dark"
                    type="text"
                    placeholder="ძებნა"
                    v-model="query"
                    ref="searchInput"
                  />
                </div>
                <div class="control">
                  <button class="button is-dark" type="submit" title="ძებნა">
                    <span class="icon">
                      <i class="mdi mdi-magnify"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div class="dropdown-menu" style="min-width: 100%">
              <div class="dropdown-content">
                <nuxt-link
                  :to="'/recipes/' + recipe.slug"
                  class="dropdown-item"
                  v-for="recipe in searchSuggestions"
                  :key="recipe._id"
                  @click="clearSuggestions()"
                >{{recipe.title}}</nuxt-link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </nav>
</template>

<style lang="scss">
.site-navbar.site-navbar.site-navbar {
  background: transparent;
  flex-shrink: 0;
  background-color: #eeeeee;
}

.site-navbar .navbar-start {
  flex-grow: 2;
  justify-content: center;
}

.site-navbar .navbar-dropdown,
.site-navbar .dropdown-content {
  // background: #f5b1a3;
  // color: white;
  border-top: none;

  .navbar-item,
  .dropdown-item {
    //color: white;
    transition: background-color 0.3s;

    &:hover,
    &:focus {
      // background: #f39a89;
      // color: white;
    }
  }
}

.navbar-item {
  transition: background-color 0.3s;
}

.navbar-item.has-dropdown .navbar-link::after {
  transform: rotate(-45deg);
  transition: transform 0.3s;
}

.navbar-item.has-dropdown:hover .navbar-link::after {
  transform: rotate(-45deg) scaleX(-1) scaleY(-1);
}

.navbar-end .navbar-dropdown {
  right: 0;
  left: auto;
}
</style>

<script>
export default {
  data() {
    return {
      showNav: false,
      showingSearch: false,
      query: "",
      searchSuggestions: []
    };
  },
  methods: {
    toggleNav() {
      this.showNav = !this.showNav;
    },
    logout() {
      this.$auth.logout();
    },
    showSearch() {
      this.showingSearch = true;
      setTimeout(() => {
        this.$refs.searchInput.focus();
      }, 10);
    },
    hideSearch() {
      this.showingSearch = false;
      this.searchSuggestions = [];
      this.query = "";
    },
    clearSuggestions() {
      this.searchSuggestions = [];
    },
    suggest() {
      if (!this.query) return;
      this.$axios
        .get("/api/posts", { params: { q: this.query } })
        .then(response => {
          this.searchSuggestions = response.data;
        })
        .catch(error => console.error(error));
    },
    search() {
      if (!this.query) return;

      this.$router.push({ path: "/search", query: { q: this.query } });
    }
  },
  watch: {
    query: "suggest",
    $route: "hideSearch"
  }
};
</script>