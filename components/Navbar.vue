<template>
  <nav class="navbar is-primary is-spaced site-navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item has-text-weight-bold" href="/">Food4.ge</a>

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
      <div class="navbar-start has-text-weight-bold">
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
        <a class="navbar-item">YouTube</a>
        <a class="navbar-item">Shop</a>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">ჩვენს შესახებ</a>
          <div class="navbar-dropdown">
            <a class="navbar-item">ვინ ვართ ჩვენ</a>
            <a class="navbar-item">ჩვენი მიზანი</a>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <nuxt-link to="/login" class="navbar-item">რეგისტრაცია / შესვლა</nuxt-link>
      </div>
    </div>
  </nav>
</template>

<style lang="scss">
.site-navbar.site-navbar.site-navbar {
  background: transparent;
  /* background: linear-gradient(rgba(34,34,34,0.9), rgba(34,34,34,0)); */
  flex-shrink: 0;
  font-family: "ArchyEDT-Bold", sans-serif;
}

.site-navbar .navbar-start {
  flex-grow: 2;
  justify-content: center;
}
</style>

<script>
export default {
    data() {
        return {
            showNav: false
        }
    },
    methods: {
        toggleNav() {
            this.showNav = !this.showNav
        }
    }
}
</script>