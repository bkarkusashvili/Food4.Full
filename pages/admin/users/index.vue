<template>
  <div>
    <h1 class="title">მომხმარებლები</h1>

    <form class="form">
      <div class="field is-grouped">
        <div class="control">
          <nuxt-link to="/admin/users/new" class="button is-success">
            <span class="icon">
              <i class="mdi mdi-plus"></i>
            </span>
            <span>ახლის დამატება</span>
          </nuxt-link>
        </div>
        <div class="control">
          <div class="select">
            <select v-model="filter.role" @change="search()">
              <option value>ყველა</option>
              <option value="admin">ადმინისტრატორი</option>
              <option value="user">მომხმარებელი</option>
            </select>
          </div>
        </div>
      </div>
    </form>

    <table class="table is-striped is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>სახელი</th>
          <th>როლი</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>
            <nuxt-link :to="'/admin/users/' + user._id">{{user.name}}</nuxt-link>
          </td>
          <td>
            {{user.role}}
          </td>
          <td style="width: 1em">
            <div class="dropdown is-hoverable is-right">
              <div class="dropdown-trigger">
                <button
                  class="button is-primary"
                  aria-haspopup="true"
                  aria-controls="dropdown-menu"
                >
                  <span>მოქმედება</span>
                  <span class="icon">
                    <i class="mdi mdi-chevron-down" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
              <div class="dropdown-menu" id="dropdown-menu" role="menu">
                <div class="dropdown-content">
                  
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      filter: {
        role: ""
      }
    };
  },
  methods: {
    search() {
      this.$axios
      .get("/api/admin/users", { params: this.filter })
      .then(response => {
        this.users = response.data;
      })
      .catch(err => {
        console.error(err);
      })
    }
  },
  asyncData({ $axios, error }) {
    return $axios
      .get("/api/admin/users")
      .then(response => {
        return { users: response.data };
      })
      .catch(err => {
        error({ statusCode: 500, message: "მოხდა შეცდომა" });
      });
  }
};
</script>

<style>
</style>