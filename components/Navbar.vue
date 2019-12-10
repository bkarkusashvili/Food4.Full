<template>
  <nav class="navbar site-navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a href="/" class="navbar-item has-text-weight-bold">
        <img :src="$store.state.settings.logo" alt />
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
      <div class="navbar-start" @click="showNav = false">
        <nav-item v-for="item in $store.state.settings.navigation" :item="item" :key="item.id" />
      </div>

      <div class="navbar-end" v-show="!showingSearch">
        <a class="navbar-item" @click="showSearch()">
          <span class="icon">
            <i class="mdi mdi-magnify"></i>
          </span>
          <span>ძებნა</span>
        </a>
        <div
          class="navbar-item has-dropdown navbar-cart"
          v-if="$auth.user"
          v-show="false"
          :class="{'active': cartActive}"
        >
          <a class="navbar-link is-arrowless" @click="cartActive = !cartActive" title="კალათა">
            <span class="icon">
              <i
                class="mdi mdi-cart has-badge-rounded has-badge-black has-badge-bottom"
                :data-badge="$store.getters['cart/itemCount']"
                aria-hidden="true"
                v-if="$store.state.cart.items.length"
              ></i>
              <i class="mdi mdi-cart" aria-hidden="true" v-else></i>
            </span>
            <span class="is-hidden-desktop">კალათა</span>
          </a>
          <div class="navbar-dropdown" @click="showNav = false">
            <cart />
          </div>
        </div>
        <nuxt-link
          :to="'/login?return=' + $route.path"
          class="navbar-item"
          v-if="!$auth.user"
        >შესვლა / რეგისტრაცია</nuxt-link>
        <div class="navbar-item has-dropdown" v-if="$auth.user" :class="{'active': userMenuActive}">
          <a class="navbar-link" @click="userMenuActive = !userMenuActive">
            <span class="icon">
              <i class="mdi mdi-account" aria-hidden="true"></i>
            </span>
            <span>{{$auth.user.name}}</span>
          </a>
          <div class="navbar-dropdown" @click="showNav = false">
            <nuxt-link to="/admin" class="navbar-item" v-if="$auth.user.role === 'admin'">
              <span class="icon">
                <i class="mdi mdi-radioactive" aria-hidden="true"></i>
              </span>
              <span>სამართავი პანელი</span>
            </nuxt-link>
            <nuxt-link to="/favorites" class="navbar-item">
              <span class="icon">
                <i class="mdi mdi-star" aria-hidden="true"></i>
              </span>
              <span>ფავორიტები</span>
            </nuxt-link>
            <!--<nuxt-link to="/users/me" class="navbar-item">
              <span class="icon">
                <i class="mdi mdi-account" aria-hidden="true"></i>
              </span>
              <span>პროფილი</span>
            </nuxt-link>-->
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
                  <button class="button" type="reset" title="დაბრუნება" @click="hideSearch()">
                    <span class="icon">
                      <i class="mdi mdi-close"></i>
                    </span>
                  </button>
                </div>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    placeholder="ძებნა"
                    v-model="query"
                    ref="searchInput"
                  />
                </div>
                <div class="control">
                  <button class="button" type="submit" title="ძებნა">
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

.site-navbar .navbar-dropdown {
  z-index: 0;
  box-shadow: 0 0 8px rgba(10, 10, 10, 0.1);
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

.site-navbar input {
  box-shadow: none !important;
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

.navbar-item.has-dropdown > .navbar-link {
  z-index: 2;
}

.navbar-end .navbar-dropdown {
  right: 0;
  left: auto;
}

.navbar-cart .navbar-dropdown {
  padding: 0;
}
</style>

<script>
import NavItem from "./NavItem";
import Cart from "./Cart";

export default {
  components: { Cart },
  data() {
    return {
      showNav: false,
      showingSearch: false,
      cartActive: false,
      query: "",
      searchSuggestions: [],
      userMenuActive: false
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