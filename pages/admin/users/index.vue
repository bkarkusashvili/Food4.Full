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
            <select v-model="filter.role">
              <option value>ყველა</option>
              <option value="admin">ადმინისტრატორი</option>
              <option value="user">მომხმარებელი</option>
            </select>
          </div>
        </div>
        <div class="control">
          <input type="text" class="input" v-model="filter.q" placeholder="ძებნა" />
        </div>
      </div>
    </form>

    <table class="table is-striped is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>სახელი</th>
          <th>ელ-ფოსტა</th>
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
            <span v-if="user.email">{{user.email}}</span>
            <span v-else-if="user.unconfirmedEmail" style="color: #777" title="დაუდასტურებელი">
              <i class="mdi mdi-alert"></i>
              {{user.unconfirmedEmail}}
            </span>
          </td>
          <td>{{user.role}}</td>
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
                  <nuxt-link :to="'/admin/users/' + user._id" class="dropdown-item">
                    <span class="icon">
                      <i class="mdi mdi-file-document-edit"></i>
                    </span>
                    <span>რედაქტირება</span>
                  </nuxt-link>
                  <a
                    class="dropdown-item has-text-danger"
                    @click="deleteUser(user)"
                    v-if="user._id !== $auth.user._id"
                  >
                    <span class="icon">
                      <i class="mdi mdi-delete"></i>
                    </span>
                    <span>წაშლა</span>
                  </a>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <pagination :page="page" :per-page="perPage" :total="total" @goto="gotoPage" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      total: 1,
      page: 1,
      perPage: 25,
      filter: {
        role: ""
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    gotoPage(page) {
      this.page = parseInt(page);
      this.fetchData();
    },
    fetchData() {
      this.$axios
        .get("/api/admin/users", { params: this.queryParams() })
        .then(response => {
          this.users = response.data;
          let total = response.headers["x-total-count"];
          if (!isNaN(total)) this.total = parseInt(total);
        })
        .catch(err => {
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
    },
    deleteUser(user) {
      if (!confirm("ნამდვილად გსურთ მომხმარებლის წაშლა?")) return;
      this.$axios
        .delete("/api/admin/users/" + user._id)
        .then(response => {
          this.fetchData();
        })
        .catch(err => {
          console.error(err);
          this.$notifyError({
            title: "მოხდა შეცდომა!",
            text: err.message
          });
        });
    },
    queryParams() {
      return Object.assign({}, this.filter, {
        offset: (this.page - 1) * this.perPage,
        limit: this.perPage
      });
    }
  },
  watch: {
    $route: "fetchData",
    "filter.role": "fetchData",
    "filter.q": "fetchData"
  }
};
</script>

<style>
</style>