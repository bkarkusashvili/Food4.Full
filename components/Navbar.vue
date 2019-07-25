<template>
  <nav class="navbar site-navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a href="/" class="navbar-item has-text-weight-bold">
        <img src="/logo.png" alt />
      </a>

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
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">რეცეპტები</a>
          <div class="navbar-dropdown">
            <a class="navbar-item">ქართული</a>
            <a class="navbar-item">ევროპული</a>
            <a class="navbar-item">აზიური</a>
            <a class="navbar-item">ვეგანური</a>
            <a class="navbar-item">დიეტური</a>
            <a class="navbar-item">დესერტი</a>
          </div>
        </div>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">ბავშვთა კვება</a>
          <div class="navbar-dropdown">
            <a class="navbar-item">2-6 წლამდე</a>
            <a class="navbar-item">6-13 წლამდე</a>
            <a class="navbar-item">13-18 წლამდე</a>
          </div>
        </div>
        <a class="navbar-item">ჩემი სახლი</a>
        <a class="navbar-item has-text-danger has-text-weight-bold">YouTube</a>
        <a class="navbar-item">Shop</a>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">ჩვენს შესახებ</a>
          <div class="navbar-dropdown">
            <a class="navbar-item">ვინ ვართ ჩვენ</a>
            <a class="navbar-item">ჩვენი მიზანი</a>
          </div>
        </div>
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