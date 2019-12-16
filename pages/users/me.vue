<template>
  <div class="user-page">
    <div class="container">
      <div class="user-profile">
        <h1 class="title">{{$auth.user.name}}</h1>
        <h2 class="subtitle">{{$auth.user.email}}</h2>
      </div>
      <div class="tabs">
        <ul>
          <nuxt-link tag="li" to="/users/me" active-class="is-active" exact>
            <a>ფავორიტები</a>
          </nuxt-link>
          <nuxt-link tag="li" to="/users/me/orders" active-class="is-active" exact>
            <a>შეკვეთები</a>
          </nuxt-link>
          <nuxt-link tag="li" to="/users/me/edit" active-class="is-active" exact>
            <a>პროფილის რედაქტირება</a>
          </nuxt-link>
        </ul>
      </div>

      <nuxt-child />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.user-page {
  padding-bottom: 2em;

  .user-profile {
    padding: .5em;
    margin-bottom: 1em;
  }

  .tabs {
    margin-bottom: 0;
  }
}
</style>